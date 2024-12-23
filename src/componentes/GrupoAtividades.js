import React, { useEffect, useState } from 'react';
import { Button, Form, Table, Image, Row, Col, Container, Card, Modal, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Atividades({ token }) {
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState({
    nomdeDaAtividade: '',
    fotoDaAtividade: null,
    descicaoDaAtividade: '',
    tipoDeAtividade: '',
    marco: '',
    idade: 1,
    exercicios: [],
  });

  const [selectedAtividade, setSelectedAtividade] = useState({
    nomdeDaAtividade: '',
    fotoDaAtividade: '',
    descicaoDaAtividade: '',
    tipoDeAtividade: '',
    marco: '',
    idade: 1,
    exercicios: [],
  });

  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  const filterOptions = {
    '': 'Todos',
    'socializacao': 'Socialização',
    'cognicao': 'Cognição',
    'linguagem': 'Linguagem',
    'autoCuidado': 'Auto Cuidado',
    'motor': 'Motor',
  };

  const [filteredAtividades, setFilteredAtividades] = useState([]);

  const tokenMidia = '?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D';
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('id');
      setUserId(id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAtividades();
    }
  }, [token, userId]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, filter]);

  const fetchAtividades = async () => {
    try {
      const response = await fetch(`${api}/atividadeApp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAtividades(data);
      setFilteredAtividades(data); // Inicialmente, mostre todas as atividades
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    }
  };

  const handleSearch = () => {
    const lowercasedFilter = filter.toLowerCase();
    const lowercasedSearchQuery = searchQuery.toLowerCase();

    const filteredData = atividades.filter((atividade) => {
      const matchSearch = atividade.nomdeDaAtividade.toLowerCase().includes(lowercasedSearchQuery) ||
                          atividade.descicaoDaAtividade.toLowerCase().includes(lowercasedSearchQuery) ||
                          atividade.criador.nome.toLowerCase().includes(lowercasedSearchQuery) ||
                          atividade.marco.toLowerCase().includes(lowercasedSearchQuery);

      const matchFilter = lowercasedFilter === '' || atividade.tipoDeAtividade.toLowerCase() === lowercasedFilter;

      return matchSearch && matchFilter;
    });

    setFilteredAtividades(filteredData);
  };

  const handleDropdownSelect = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handleInputChange = (key, value) => {
    if (key === 'tipoDeAtividade') {
      let marco = novaAtividade.marco;
      switch (value) {
        case 'socializacao':
          marco = 'S' + marco.slice(1);
          break;
        case 'cognicao':
          marco = 'C' + marco.slice(1);
          break;
        case 'linguagem':
          marco = 'L' + marco.slice(1);
          break;
        case 'autoCuidado':
          marco = 'A' + marco.slice(1);
          break;
        case 'motor':
          marco = 'M' + marco.slice(1);
          break;
        default:
          break;
      }
      setNovaAtividade(prev => ({ ...prev, [key]: value, marco }));
    } else {
      setNovaAtividade(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSelectAtividadeInputChange = (key, value) => {
    if (key === 'tipoDeAtividade') {
      let marco = selectedAtividade.marco;
      switch (value) {
        case 'socializacao':
          marco = 'S' + marco.slice(1);
          break;
        case 'cognicao':
          marco = 'C' + marco.slice(1);
          break;
        case 'linguagem':
          marco = 'L' + marco.slice(1);
          break;
        case 'autoCuidado':
          marco = 'A' + marco.slice(1);
          break;
        case 'motor':
          marco = 'M' + marco.slice(1);
          break;
        default:
          break;
      }
      setSelectedAtividade(prev => ({ ...prev, [key]: value, marco }));
    } else {
      setSelectedAtividade(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleExerciseInputChange = (exercicioIndex, key, value) => {
    const novosExercicios = [...novaAtividade.exercicios];
    if (novosExercicios[exercicioIndex]) {
      novosExercicios[exercicioIndex][key] = value;
      setNovaAtividade(prev => ({ ...prev, exercicios: novosExercicios }));
    }
  };

  const handleAlternativaChange = (exercicioIndex, alternativaIndex, event) => {
    const { name, value, checked } = event.target;
    const exerciciosClone = [...novaAtividade.exercicios];
    if (exerciciosClone[exercicioIndex]) {
      const exercicio = exerciciosClone[exercicioIndex];
      if (!exercicio.alternativas[alternativaIndex]) {
        exercicio.alternativas[alternativaIndex] = {};
      }
      if (name === 'alternativa') {
        exercicio.alternativas[alternativaIndex].alternativa = value;
      } else if (name === 'resultado') {
        exercicio.alternativas[alternativaIndex].resultadoAlternativa = checked;
      }
      setNovaAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
    }
  };

  const handleAddAlternativa = (exercicioIndex, isEdit = false) => {
    const exerciciosClone = isEdit ? [...selectedAtividade.exercicios] : [...novaAtividade.exercicios];
    if (exerciciosClone[exercicioIndex]) {
      const novasAlternativas = {
        alternativa: '',
        resultadoAlternativa: false,
      };
      if (!Array.isArray(exerciciosClone[exercicioIndex].alternativas)) {
        exerciciosClone[exercicioIndex].alternativas = [];
      }
      exerciciosClone[exercicioIndex].alternativas.push(novasAlternativas);
      if (isEdit) {
        setSelectedAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
      } else {
        setNovaAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
      }
    }
  };

  const handleAddExercicio = (isEdit = false) => {
    const novosExercicios = isEdit ? [...selectedAtividade.exercicios] : [...novaAtividade.exercicios];
    if (novosExercicios.length >= 1) {
      alert('Você só pode adicionar um exercício por atividade.');
      return;
    }
    const newExercicio = {
      midia: { tipoDeMidia: '', url: '' },
      enunciado: '',
      alternativas: [],
      pontuacao: 1,
    };
    novosExercicios.push(newExercicio);
    if (isEdit) {
      setSelectedAtividade(prev => ({ ...prev, exercicios: novosExercicios }));
    } else {
      setNovaAtividade(prev => ({ ...prev, exercicios: novosExercicios }));
    }
  };

  const handleDeleteAlternativa = (exercicioIndex, alternativaIndex, isEdit) => {
    const exerciciosClone = isEdit ? [...selectedAtividade.exercicios] : [...novaAtividade.exercicios];
    if (exerciciosClone[exercicioIndex]?.alternativas[alternativaIndex]) {
      exerciciosClone[exercicioIndex].alternativas.splice(alternativaIndex, 1);
      if (isEdit) {
        setSelectedAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
      } else {
        setNovaAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
      }
    }
  };

  const handleUploadFile = async (type, id, file) => {
    if (!file) return null;

    const supportedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
    if (!supportedTypes.includes(file.type)) {
      console.error('Tipo de arquivo não suportado:', file.type);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${api}/midia/post/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        console.error('Erro ao enviar o arquivo:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const atividadeId = `${userId}Atividade${novaAtividade.nomdeDaAtividade}`;
    const atividadeImage = await handleUploadFile('atividade', atividadeId, novaAtividade.fotoDaAtividade);

    const exerciciosComMidia = await Promise.all(
      novaAtividade.exercicios.map(async (exercicio, exerIndex) => {
        const midiaUrl = await handleUploadFile(
          'exercicio',
          `${atividadeId}Exercicio${exerIndex}`,
          exercicio.midia.url instanceof File ? exercicio.midia.url : null
        );
        return {
          ...exercicio,
          midia: { tipoDeMidia: exercicio.midia.tipoDeMidia, url: midiaUrl || exercicio.midia.url },
        };
      })
    );

    const estruturaJSON = {
      ...novaAtividade,
      fotoDaAtividade: atividadeImage || '',
      exercicios: exerciciosComMidia,
    };

    const response = await fetch(`${api}/atividadeApp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(estruturaJSON),
    });

    if (response.ok) {
      console.log('Atividade enviada com sucesso!');
      setNovaAtividade({
        nomdeDaAtividade: '',
        fotoDaAtividade: null,
        descicaoDaAtividade: '',
        tipoDeAtividade: '',
        marco: '',
        idade: 1,
        exercicios: [],
      });
      setModalShow(false);
      fetchAtividades();
    } else {
      alert('Falha ao salvar a atividade. Verifique os campos e tente novamente!');
    }
  };

  const handleEditAtividade = async id => {
    try {
      const response = await fetch(`${api}/atividadeApp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      setSelectedAtividade({
        ...data,
        exercicios: data.exercicios || [],
      });

      setModalEditShow(true);
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
    }
  };

  const handleSaveEditAtividade = async () => {
    const atividadeId = selectedAtividade._id;

    let atividadeImageUrl = selectedAtividade.fotoDaAtividade;
    if (selectedAtividade.fotoDaAtividade instanceof File) {
      const imageUrl = await handleUploadFile('atividade', atividadeId, selectedAtividade.fotoDaAtividade);
      if (imageUrl) {
        atividadeImageUrl = imageUrl;
      }
    }

    const updatedActivity = {
      ...selectedAtividade,
      fotoDaAtividade: atividadeImageUrl,
      exercicios: await Promise.all(
        selectedAtividade.exercicios.map(async (exercicio, exerIndex) => {
          const midiaUrl = exercicio.midia.url instanceof File
            ? await handleUploadFile('exercicio', `${atividadeId}Exercicio${exerIndex}`, exercicio.midia.url)
            : exercicio.midia.url;
          return { ...exercicio, midia: { ...exercicio.midia, url: midiaUrl } };
        })
      ),
    };
    const response = await fetch(`${api}/atividadeApp/${atividadeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedActivity),
    });

    if (response.ok) {
      console.log('Atividade editada com sucesso!');
      setModalEditShow(false);
      fetchAtividades();
    } else {
      const errorLog = await response.text();
      console.error('Erro ao editar a atividade', errorLog);
    }
  };

  const handleDeleteAtividade = async () => {
    if (!activityToDelete) return;

    const response = await fetch(`${api}/atividadeApp/${activityToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log('Atividade excluída com sucesso!');
      setModalDeleteShow(false);
      fetchAtividades();
    } else {
      console.error('Erro ao excluir a atividade', await response.text());
    }
  };

  const updateSelectedAtividade = (exerIndex, key, value) => {
    const exerciciosClone = [...selectedAtividade.exercicios];
    if (exerciciosClone[exerIndex]) {
      exerciciosClone[exerIndex][key] = value;
      setSelectedAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
    }
  };

  return (
    <Container className="container mt-5">
      <h1>Todas as atividades</h1>
      <br />
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <Button variant="success" onClick={() => setModalShow(true)}>Criar Atividade</Button>
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Dropdown onSelect={handleDropdownSelect}>
            <Dropdown.Toggle variant="secondary">
              {filterOptions[filter] || 'Filtrar Tipo de Atividade'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="">Todos</Dropdown.Item>
              <Dropdown.Item eventKey="socializacao">Socialização</Dropdown.Item>
              <Dropdown.Item eventKey="cognicao">Cognição</Dropdown.Item>
              <Dropdown.Item eventKey="linguagem">Linguagem</Dropdown.Item>
              <Dropdown.Item eventKey="autoCuidado">Auto Cuidado</Dropdown.Item>
              <Dropdown.Item eventKey="motor">Motor</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Modal de Criação */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Atividade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Imagem da Atividade</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNovaAtividade({ ...novaAtividade, fotoDaAtividade: e.target.files[0] })}
                  />
                </Form.Group>
                {novaAtividade.fotoDaAtividade && (
                  <Image
                    src={URL.createObjectURL(novaAtividade.fotoDaAtividade)}
                    alt="Preview da Atividade"
                    thumbnail
                    style={{ marginTop: '10px', maxWidth: '100%' }}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome da Atividade</Form.Label>
                  <Form.Control
                    type="text"
                    value={novaAtividade.nomdeDaAtividade}
                    onChange={(e) => handleInputChange('nomdeDaAtividade', e.target.value)}
                    placeholder="Nome da Atividade"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Idade</Form.Label>
                  <Form.Control
                    type="number"
                    value={novaAtividade.idade}
                    onChange={(e) => handleInputChange('idade', e.target.value)}
                    placeholder="Idade"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo de Atividade</Form.Label>
                  <Form.Select
                    value={novaAtividade.tipoDeAtividade}
                    onChange={(e) => handleInputChange('tipoDeAtividade', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="socializacao">Socialização</option>
                    <option value="cognicao">Cognição</option>
                    <option value="linguagem">Linguagem</option>
                    <option value="autoCuidado">Auto Cuidado</option>
                    <option value="motor">Motor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marco</Form.Label>
                  <Form.Control
                    type="text"
                    value={novaAtividade.marco}
                    onChange={(e) => handleInputChange('marco', e.target.value)}
                    placeholder="Marco"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={9}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={novaAtividade.descicaoDaAtividade}
                    onChange={(e) => handleInputChange('descicaoDaAtividade', e.target.value)}
                    placeholder="Descreva a atividade"
                  />
                </Form.Group>
              </Col>
            </Row>

            {novaAtividade.exercicios.map((exercicio, exerIndex) => (
              <Card key={exerIndex} className="mt-3">
                <Card.Body>
                  <Card.Title>Exercício {exerIndex + 1}</Card.Title>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Mídia (Imagem/Vídeo)</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*, video/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const novosExercicios = [...novaAtividade.exercicios];
                              const atividadeId = `${userId}Atividade${novaAtividade.nomdeDaAtividade}Exercicio${exerIndex}`;
                              const url = await handleUploadFile('exercicio', atividadeId, file);
                              if (url) {
                                novosExercicios[exerIndex].midia = {
                                  tipoDeMidia: file.type,
                                  url: url
                                };
                                setNovaAtividade(prev => ({ ...prev, exercicios: novosExercicios }));
                              } else {
                                console.error('Falha no upload da mídia');
                              }
                            }
                          }}
                        />
                        {exercicio.midia.url && (
                          <div style={{ marginTop: '10px' }}>
                            {exercicio.midia.tipoDeMidia.includes('image') ? (
                              <Image
                                src={`${exercicio.midia.url}${tokenMidia}`}
                                alt="Preview do Exercício"
                                thumbnail
                                style={{ maxWidth: '100%' }}
                              />
                            ) : (
                              <video width="100%" controls>
                                <source src={`${exercicio.midia.url}${tokenMidia}`} type={exercicio.midia.tipoDeMidia} />
                                Seu navegador não suporta a tag de vídeo.
                              </video>
                            )}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Enunciado</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={exercicio.enunciado}
                          onChange={(e) => handleExerciseInputChange(exerIndex, 'enunciado', e.target.value)}
                          placeholder="Enunciado"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {exercicio.alternativas.map((alternativa, alternativaIndex) => (
                      <Form.Group key={alternativaIndex} className="mt-2">
                        <Row>
                          <Col xs={1}>
                            <Button variant="outline-danger" onClick={() => handleDeleteAlternativa(exerIndex, alternativaIndex, false)}>🗑</Button>
                          </Col>
                          <Col xs={11}>
                            <Row>
                              <Col md={8}>
                                <Form.Control
                                  type="text"
                                  value={alternativa.alternativa || ''}
                                  placeholder="Texto da alternativa"
                                  onChange={(e) => handleAlternativaChange(exerIndex, alternativaIndex, { target: { value: e.target.value, name: 'alternativa' } })}
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Check
                                  type="checkbox"
                                  label="Correta"
                                  checked={alternativa.resultadoAlternativa}
                                  onChange={(e) => handleAlternativaChange(exerIndex, alternativaIndex, { target: { checked: e.target.checked, name: 'resultado' } })}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form.Group>
                    ))}
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Button variant="secondary" onClick={() => handleAddAlternativa(exerIndex, false)}>Adicionar Alternativa</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <br />
            <div className="w-100 d-flex justify-content-between">
              <Button variant="primary" onClick={() => handleAddExercicio(false)}>Adicionar Exercício</Button>
              <Button variant="success" onClick={handleSubmit}>Salvar Atividade</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Edição */}
      <Modal show={modalEditShow} onHide={() => setModalEditShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Atividade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Imagem da Atividade</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedAtividade((prev) => ({ ...prev, fotoDaAtividade: file }));
                      }
                    }}
                  />
                </Form.Group>
                {selectedAtividade.fotoDaAtividade && (
                  <Image
                    src={
                      typeof selectedAtividade.fotoDaAtividade === 'string'
                        ? `${selectedAtividade.fotoDaAtividade}${tokenMidia}`
                        : selectedAtividade.fotoDaAtividade instanceof File
                        ? URL.createObjectURL(selectedAtividade.fotoDaAtividade)
                        : ''
                    }
                    alt="Preview da Atividade"
                    thumbnail
                    style={{ marginTop: '10px', maxWidth: '100%' }}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome da Atividade</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedAtividade.nomdeDaAtividade}
                    onChange={(e) => handleSelectAtividadeInputChange('nomdeDaAtividade', e.target.value)}
                    placeholder="Nome da Atividade"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Idade</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedAtividade.idade}
                    onChange={(e) => handleSelectAtividadeInputChange('idade', e.target.value)}
                    placeholder="Idade"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo de Atividade</Form.Label>
                  <Form.Select
                    value={selectedAtividade.tipoDeAtividade}
                    onChange={(e) => handleSelectAtividadeInputChange('tipoDeAtividade', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="socializacao">Socialização</option>
                    <option value="cognicao">Cognição</option>
                    <option value="linguagem">Linguagem</option>
                    <option value="autoCuidado">Auto Cuidado</option>
                    <option value="motor">Motor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marco</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedAtividade.marco}
                    onChange={(e) => handleSelectAtividadeInputChange('marco', e.target.value)}
                    placeholder="Marco"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={9}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={selectedAtividade.descicaoDaAtividade}
                    onChange={(e) => handleSelectAtividadeInputChange('descicaoDaAtividade', e.target.value)}
                    placeholder="Descreva a atividade"
                  />
                </Form.Group>
              </Col>
            </Row>

            {selectedAtividade.exercicios.map((exercicio, exerIndex) => (
              <Card key={exerIndex} className="mt-3">
                <Card.Body>
                  <Card.Title>Exercício {exerIndex + 1}</Card.Title>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Mídia (Imagem/Vídeo)</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*, video/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const exerciciosClone = [...selectedAtividade.exercicios];
                              const atividadeId = `${userId}Atividade${selectedAtividade.nomdeDaAtividade}Exercicio${exerIndex}`;
                              const url = await handleUploadFile('exercicio', atividadeId, file);
                              if (url) {
                                exerciciosClone[exerIndex].midia = {
                                  tipoDeMidia: file.type,
                                  url: url
                                };
                                setSelectedAtividade(prev => ({ ...prev, exercicios: exerciciosClone }));
                              } else {
                                console.error('Falha no upload da mídia');
                              }
                            }
                          }}
                        />
                        {exercicio.midia.url && (
                          <div style={{ marginTop: '10px' }}>
                            {exercicio.midia.tipoDeMidia.includes('image') ? (
                              <Image
                                src={`${exercicio.midia.url}${tokenMidia}`}
                                alt="Preview do Exercício"
                                thumbnail
                                style={{ maxWidth: '100%' }}
                              />
                            ) : (
                              <video width="100%" controls>
                                <source src={`${exercicio.midia.url}${tokenMidia}`} type={exercicio.midia.tipoDeMidia} />
                                Seu navegador não suporta a tag de vídeo.
                              </video>
                            )}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Enunciado</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={exercicio.enunciado}
                          onChange={(e) => updateSelectedAtividade(exerIndex, 'enunciado', e.target.value)}
                          placeholder="Enunciado"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {exercicio.alternativas.map((alternativa, alternativaIndex) => (
                      <Form.Group key={alternativaIndex} className="mt-2">
                        <Row>
                          <Col xs={1}>
                            <Button variant="outline-danger" onClick={() => handleDeleteAlternativa(exerIndex, alternativaIndex, true)}>🗑</Button>
                          </Col>
                          <Col xs={11}>
                            <Row>
                              <Col md={8}>
                                <Form.Control
                                  type="text"
                                  value={alternativa.alternativa || ''}
                                  placeholder="Texto da alternativa"
                                  onChange={(e) => handleAlternativaChange(exerIndex, alternativaIndex, { target: { value: e.target.value, name: 'alternativa' } })}
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Check
                                  type="checkbox"
                                  label="Correta"
                                  checked={alternativa.resultadoAlternativa}
                                  onChange={(e) => handleAlternativaChange(exerIndex, alternativaIndex, { target: { checked: e.target.checked, name: 'resultado' } })}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form.Group>
                    ))}
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Button variant="secondary" onClick={() => handleAddAlternativa(exerIndex, true)}>Adicionar Alternativa</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <br />
            <div className="w-100 d-flex justify-content-between">
              <Button variant="primary" onClick={() => handleAddExercicio(true)}>Adicionar Exercício</Button>
              <Button variant="success" onClick={handleSaveEditAtividade}>Salvar Alterações</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal show={modalDeleteShow} onHide={() => setModalDeleteShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja excluir esta atividade?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteAtividade}>Excluir</Button>
          <Button variant="success" onClick={() => setModalDeleteShow(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      {/* Tabela das Atividades */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th></th>
            <th>Nome da Atividade</th>
            <th>Descrição</th>
            <th>Criador</th>
            <th>Marco</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAtividades.map(atividade => (
            <tr key={atividade._id}>
              <td>
                <Image
                  width="50"
                  height="50"
                  src={`${atividade.fotoDaAtividade}${tokenMidia}`}
                  alt="Imagem da atividade"
                  thumbnail
                />
              </td>
              <td>{atividade.nomdeDaAtividade}</td>
              <td style={{ maxWidth: '30vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                {atividade.descicaoDaAtividade}
              </td>
              <td>{atividade.criador.nome}</td>
              <td>{atividade.marco}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditAtividade(atividade._id)}>✏</Button>{' '}
                <Button variant="danger" onClick={() => { setActivityToDelete(atividade._id); setModalDeleteShow(true); }}>❌</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
