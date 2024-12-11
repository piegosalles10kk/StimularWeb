import React, { useEffect, useState } from 'react';
import { Button, Form, Table, Image, Row, Col, Container, Card, Modal } from 'react-bootstrap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../utils/api';

export default function AtividadesCadastradas({ token }) {
    const [atividades, setAtividades] = useState([]);
    const [novaAtividade, setNovaAtividade] = useState({
        nomeGrupo: '',
        imagem: null,
        descricao: '',
        nivelDaAtividade: 1,
        dominio: ['TEA'],
        atividades: []
    });

    const [selectedAtividade, setSelectedAtividade] = useState({
        nomeGrupo: '',
        descricao: '',
        nivelDaAtividade: 1,
        atividades: []
    });

    const [modalShow, setModalShow] = useState(false);
    const [modalEditShow, setModalEditShow] = useState(false);
    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);

    const tokenMidia = "?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D";

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
            const fetchAtividades = async () => {
                try {
                    const response = await fetch(`${api}/grupoatividades`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setAtividades(data.grupos);
                } catch (error) {
                    console.error('Erro ao buscar atividades:', error);
                }
            };

            fetchAtividades();
        }
    }, [token, userId]);

    const handleAddAlternativa = (atividadeIndex) => {
        const novasAtividades = [...novaAtividade.atividades];
        novasAtividades[atividadeIndex].exercicios[0].alternativas.push({
            alternativa: '',
            resultadoAlternativa: false
        });
        setNovaAtividade({ ...novaAtividade, atividades: novasAtividades });
    };

    const handleInputChange = (atividadeIndex, key, value) => {
        const novasAtividades = [...novaAtividade.atividades];
        novasAtividades[atividadeIndex][key] = value;
        setNovaAtividade({ ...novaAtividade, atividades: novasAtividades });
    };

    const handleExerciseInputChange = (atividadeIndex, exercicioIndex, key, value) => {
        const novasAtividades = [...novaAtividade.atividades];
        novasAtividades[atividadeIndex].exercicios[exercicioIndex][key] = value;
        setNovaAtividade({ ...novaAtividade, atividades: novasAtividades });
    };

    const handleAlternativaChange = (atividadeIndex, exercicioIndex, alternativaIndex, event) => {
        const { value, checked, name: inputName } = event.target;
        const atividadesClone = [...novaAtividade.atividades];

        if (inputName === 'alternativa') {
            atividadesClone[atividadeIndex].exercicios[exercicioIndex].alternativas[alternativaIndex].alternativa = value;
        } else if (inputName === 'resultado') {
            atividadesClone[atividadeIndex].exercicios[exercicioIndex].alternativas[alternativaIndex].resultadoAlternativa = checked;
        }

        setNovaAtividade(prev => ({
            ...prev,
            atividades: atividadesClone
        }));
    };

    const handleUploadFile = async (type, id, file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${api}/midia/post/${id}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
        
        console.error('Erro ao enviar o arquivo');
        return null;
    };

    const handleAddAtividade = () => {
        setNovaAtividade(prev => ({
            ...prev,
            atividades: [
                ...prev.atividades,
                {
                    nomdeDaAtividade: '',
                    fotoDaAtividade: null,
                    tipoDeAtividade: '',
                    enunciado: '',
                    exercicios: [{
                        midia: {
                            tipoDeMidia: '',
                            url: ''
                        },
                        enunciado: '',
                        alternativas: [],
                        pontuacao: 1
                    }],
                    pontuacaoTotalAtividade: 1
                }
            ]
        }));
    };
    const refreshAtividades = async () => {
        if (userId) {
            const response = await fetch(`${api}/grupoatividades`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setAtividades(data.grupos);
        }
    };

    const handleEditAtividade = async (id) => {
        try {
            const response = await fetch(`${api}/grupoatividades/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            
            setSelectedAtividade({
                ...data,
                atividades: data.atividades || [] // Garante que seja sempre um array
            });
            
            
            
            setModalEditShow(true); // Mostra o modal de edição
        } catch (error) {
            console.error('Erro ao buscar atividade:', error);
        }
    };

    const handleSaveEditAtividade = async () => {
        if (!selectedAtividade || !userId) {
            console.error('ID do usuário ou atividade não encontrado!');
            return;
        }

        const activityId = selectedAtividade._id;
        const updatedActivity = {
            ...selectedAtividade,
            atividades: selectedAtividade.atividades // Adicione outros campos se necessário
        };

        const response = await fetch(`${api}/grupoatividades/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedActivity)
        });

        if (response.ok) {
            console.log('Atividade editada com sucesso!');
            setModalEditShow(false);
            window.location.reload(); // Recarrega a lista após edição
        } else {
            console.error('Erro ao editar a atividade', await response.text());
        }
    };
    const handleDeleteAtividade = async () => {
        if (!activityToDelete) return;

        const response = await fetch(`${api}/grupoatividades/${activityToDelete}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log('Atividade excluída com sucesso!');
            setModalDeleteShow(false);
            refreshAtividades();
        } else {
            console.error('Erro ao excluir a atividade', await response.text());
        }
    };

    const handleSubmit = async () => {
        if (!userId || !novaAtividade.atividades.length) {
            console.error('ID do usuário ou atividade não encontrado!');
            return;
        }

        const groupId = `${userId}Grupo${novaAtividade.atividades.length}`;
        const groupImage = await handleUploadFile('group', groupId, novaAtividade.imagem);

        const atividadesComMidia = await Promise.all(novaAtividade.atividades.map(async (atividade, index) => {
            const atividadeId = `${userId}Grupo${novaAtividade.atividades.length}Atividade${index}`;
            const atividadeImage = await handleUploadFile('atividade', atividadeId, atividade.fotoDaAtividade);
            
            return {
                nomdeDaAtividade: atividade.nomdeDaAtividade,
                fotoDaAtividade: atividadeImage ? atividadeImage.url : '',
                tipoDeAtividade: atividade.tipoDeAtividade,
                enunciado: atividade.enunciado,
                exercicios: await Promise.all(atividade.exercicios.map(async (exercicio, exerIndex) => {
                    const midiaExercicioImage = await handleUploadFile('midia', `${atividadeId}Exercicio${exerIndex}`, exercicio.midia.url);
                    return {
                        midia: {
                            tipoDeMidia: exercicio.midia.tipoDeMidia,
                            url: midiaExercicioImage ? midiaExercicioImage.url : ''
                        },
                        enunciado: exercicio.enunciado,
                        alternativas: exercicio.alternativas,
                        pontuacao: exercicio.pontuacao
                    };
                })),
                pontuacaoTotalAtividade: 1
            };
        }));

        const estruturaJSON = {
            nomeGrupo: novaAtividade.nomeGrupo,
            nivelDaAtividade: novaAtividade.nivelDaAtividade,
            identificador: groupId,
            imagem: groupImage ? groupImage.url : '',
            descricao: novaAtividade.descricao,
            dominio: novaAtividade.dominio,
            atividades: atividadesComMidia
        };

        const response = await fetch(`${api}/grupoatividades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(estruturaJSON)
        });

        if (response.ok) {
            console.log('Atividade enviada com sucesso!');
            setNovaAtividade({
                nomeGrupo: '',
                imagem: null,
                descricao: '',
                nivelDaAtividade: 1,
                dominio: ['TEA', 'TDAH', 'TOD'],
                atividades: []
            });
            setModalShow(false);
        } else {
            console.error('Erro ao enviar a atividade', await response.text());
        }
    };

    return (
        <Container>
            <br />
            <Button variant="success" onClick={() => setModalShow(true)}>
                Criar Atividade
            </Button>

            {/* Modal de Criação */}
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Adicionar Nova Atividade
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nome do Grupo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={novaAtividade.nomeGrupo}
                                        onChange={(e) => setNovaAtividade({ ...novaAtividade, nomeGrupo: e.target.value })}
                                        placeholder="Digite o nome do Grupo"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Imagem do Grupo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNovaAtividade({ ...novaAtividade, imagem: e.target.files[0] })}
                                    />
                                </Form.Group>
                                {novaAtividade.imagem && (
                                    <Image 
                                        src={URL.createObjectURL(novaAtividade.imagem)} 
                                        alt="Preview do Grupo" 
                                        thumbnail 
                                        style={{ marginTop: '10px', maxWidth: '100%' }} 
                                    />
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={novaAtividade.descricao}
                                        onChange={(e) => setNovaAtividade({ ...novaAtividade, descricao: e.target.value })}
                                        placeholder="Descreva a atividade"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Idade da Atividade</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={novaAtividade.nivelDaAtividade}
                                        onChange={(e) => setNovaAtividade({ ...novaAtividade, nivelDaAtividade: e.target.value })}
                                        placeholder="Nível (1-10)"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {novaAtividade.atividades.map((atividade, atividadeIndex) => (
                            <Card className="mt-3" key={atividadeIndex}>
                                <Card.Body>
                                    <Card.Title>Atividade {atividadeIndex + 1}</Card.Title>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Nome da Atividade</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={atividade.nomdeDaAtividade}
                                                    onChange={(e) => handleInputChange(atividadeIndex, 'nomdeDaAtividade', e.target.value)}
                                                    placeholder="Nome da Atividade"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Tipo de Atividade</Form.Label>
                                                <Form.Select
                                                    value={atividade.tipoDeAtividade}
                                                    onChange={(e) => handleInputChange(atividadeIndex, 'tipoDeAtividade', e.target.value)}
                                                >
                                                    <option value="">Selecione...</option>
                                                    <option value="Fisica">Física</option>
                                                    <option value="Linguistica">Linguística</option>
                                                    <option value="Cognitiva">Cognitiva</option>
                                                    <option value="Socioafetiva">Socioafetiva</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Imagem da Atividade</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleInputChange(atividadeIndex, 'fotoDaAtividade', e.target.files[0])} // Manipulando a imagem da atividade
                                                />
                                            </Form.Group>
                                            {atividade.fotoDaAtividade && (
                                                <Image 
                                                    src={URL.createObjectURL(atividade.fotoDaAtividade)} 
                                                    alt="Preview da Atividade" 
                                                    thumbnail 
                                                    style={{ marginTop: '10px', maxWidth: '100%' }} 
                                                />
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        {atividade.exercicios.map((exercicio, exerIndex) => (
                                            <Col md={12} key={exerIndex} className="mt-3">
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>Exercício {exerIndex + 1}</Card.Title>
                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Mídia (Imagem/Vídeo)</Form.Label>
                                                                    <Form.Control
                                                                        type="file"
                                                                        accept="image/*, video/*"
                                                                        onChange={(e) => {
                                                                            const novasAtividades = [...novaAtividade.atividades];
                                                                            novasAtividades[atividadeIndex].exercicios[exerIndex].midia = {
                                                                                tipoDeMidia: e.target.files[0].type,
                                                                                url: e.target.files[0]
                                                                            };
                                                                            setNovaAtividade({ ...novaAtividade, atividades: novasAtividades });
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                                {exercicio.midia.url && (
                                                                    exercicio.midia.tipoDeMidia.startsWith('image/') ? (
                                                                        <Image 
                                                                            src={URL.createObjectURL(exercicio.midia.url)} 
                                                                            alt="Preview do Exercício" 
                                                                            thumbnail 
                                                                            style={{ marginTop: '10px', maxWidth: '100%' }} 
                                                                        />
                                                                    ) : (
                                                                        <video controls style={{ marginTop: '10px', maxWidth: '100%' }}>
                                                                            <source src={URL.createObjectURL(exercicio.midia.url)} type={exercicio.midia.tipoDeMidia} />
                                                                            Seu navegador não suporta a tag de vídeo.
                                                                        </video>
                                                                    )
                                                                )}
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Enunciado</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={exercicio.enunciado}
                                                                        onChange={(e) => handleExerciseInputChange(atividadeIndex, exerIndex, 'enunciado', e.target.value)}
                                                                        placeholder="Enunciado"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        {exercicio.alternativas.map((alternativa, index) => (
                                                            <Form.Group key={index} className="mt-2">
                                                                <Row>
                                                                    <Col md={8}>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={alternativa.alternativa || ''}
                                                                            placeholder="Texto da alternativa"
                                                                            onChange={(e) => handleAlternativaChange(atividadeIndex, exerIndex, index, { target: { value: e.target.value, name: 'alternativa' } })}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            label="Correta"
                                                                            checked={alternativa.resultadoAlternativa}
                                                                            onChange={(e) => handleAlternativaChange(atividadeIndex, exerIndex, index, { target: { checked: e.target.checked, name: 'resultado' } })}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Form.Group>
                                                        ))}
                                                        <br />
                                                        <Button variant="secondary" onClick={() => handleAddAlternativa(atividadeIndex)}>
                                                            Adicionar Alternativa
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                        <br />
                        <div style={{ float: 'left' }}>
                        <Button variant="primary" onClick={handleAddAtividade} className="mb-3">
                                                        Adicionar Atividade
                                                    </Button>
                        </div>
                        <div style={{ float: 'right' }}>
                            
                            <Button variant="success" onClick={handleSubmit}>
                                Salvar Grupo
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Edição */}
            <Modal
                show={modalEditShow}
                onHide={() => setModalEditShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Editar Atividade
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAtividade && (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Nome do Grupo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedAtividade.nomeGrupo}
                                            onChange={(e) => setSelectedAtividade({ ...selectedAtividade, nomeGrupo: e.target.value })}
                                            placeholder="Digite o nome do Grupo"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Imagem do Grupo</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setSelectedAtividade({ ...selectedAtividade, imagem: e.target.files[0] })}
                                        />
                                    </Form.Group>
                                    {selectedAtividade.imagem && (
                                        <Image 
                                            src={URL.createObjectURL(selectedAtividade.imagem)} 
                                            alt="Preview do Grupo" 
                                            thumbnail 
                                            style={{ marginTop: '10px', maxWidth: '100%' }} 
                                        />
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={selectedAtividade.descricao}
                                            onChange={(e) => setSelectedAtividade({ ...selectedAtividade, descricao: e.target.value })}
                                            placeholder="Descreva a atividade"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Idade da Atividade</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={selectedAtividade.nivelDaAtividade}
                                            onChange={(e) => setSelectedAtividade({ ...selectedAtividade, nivelDaAtividade: e.target.value })}
                                            placeholder="Nível (1-10)"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <br />
                            <Button variant="primary" onClick={handleAddAtividade} className="mb-3">
                                Adicionar Atividade
                            </Button>

                            {selectedAtividade.atividades.map((atividade, atividadeIndex) => (
                                <Card className="mt-3" key={atividadeIndex}>
                                    <Card.Body>
                                        <Card.Title>Atividade {atividadeIndex + 1}</Card.Title>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Nome da Atividade</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={atividade.nomdeDaAtividade}
                                                        onChange={(e) => handleInputChange(atividadeIndex, 'nomdeDaAtividade', e.target.value)}
                                                        placeholder="Nome da Atividade"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Tipo de Atividade</Form.Label>
                                                    <Form.Select
                                                        value={atividade.tipoDeAtividade}
                                                        onChange={(e) => handleInputChange(atividadeIndex, 'tipoDeAtividade', e.target.value)}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="Fisica">Física</option>
                                                        <option value="Linguistica">Linguística</option>
                                                        <option value="Cognitiva">Cognitiva</option>
                                                        <option value="Socioafetiva">Socioafetiva</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Imagem da Atividade</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleInputChange(atividadeIndex, 'fotoDaAtividade', e.target.files[0])} // Manipulando a imagem da atividade
                                                    />
                                                </Form.Group>
                                                {atividade.fotoDaAtividade && (
                                                    <Image 
                                                        src={URL.createObjectURL(atividade.fotoDaAtividade)} 
                                                        alt="Preview da Atividade" 
                                                        thumbnail 
                                                        style={{ marginTop: '10px', maxWidth: '100%' }} 
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                        <Row>
                                            {atividade.exercicios.map((exercicio, exerIndex) => (
                                                <Col md={12} key={exerIndex} className="mt-3">
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title>Exercício {exerIndex + 1}</Card.Title>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Mídia (Imagem/Vídeo)</Form.Label>
                                                                        <Form.Control
                                                                            type="file"
                                                                            accept="image/*, video/*"
                                                                            onChange={(e) => {
                                                                                const novasAtividades = [...selectedAtividade.atividades];
                                                                                novasAtividades[atividadeIndex].exercicios[exerIndex].midia = {
                                                                                    tipoDeMidia: e.target.files[0].type,
                                                                                    url: e.target.files[0]
                                                                                };
                                                                                setSelectedAtividade({ ...selectedAtividade, atividades: novasAtividades });
                                                                            }}
                                                                        />
                                                                    </Form.Group>
                                                                    {exercicio.midia.url && (
                                                                        exercicio.midia.tipoDeMidia.startsWith('image/') ? (
                                                                            <Image 
                                                                                src={URL.createObjectURL(exercicio.midia.url)} 
                                                                                alt="Preview do Exercício" 
                                                                                thumbnail 
                                                                                style={{ marginTop: '10px', maxWidth: '100%' }} 
                                                                            />
                                                                        ) : (
                                                                            <video controls style={{ marginTop: '10px', maxWidth: '100%' }}>
                                                                                <source src={URL.createObjectURL(exercicio.midia.url)} type={exercicio.midia.tipoDeMidia} />
                                                                                Seu navegador não suporta a tag de vídeo.
                                                                            </video>
                                                                        )
                                                                    )}
                                                                </Col>
                                                                <Col md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Enunciado</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={exercicio.enunciado}
                                                                            onChange={(e) => handleExerciseInputChange(atividadeIndex, exerIndex, 'enunciado', e.target.value)}
                                                                            placeholder="Enunciado"
                                                                            isInvalid={!exercicio.enunciado} // Marcar como inválido se vazio
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            O enunciado é obrigatório!
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            {exercicio.alternativas.map((alternativa, index) => (
                                                                <Form.Group key={index} className="mt-2">
                                                                    <Row>
                                                                        <Col md={8}>
                                                                            <Form.Control
                                                                                type="text"
                                                                                value={alternativa.alternativa || ''}
                                                                                placeholder="Texto da alternativa"
                                                                                onChange={(e) => handleAlternativaChange(atividadeIndex, exerIndex, index, { target: { value: e.target.value, name: 'alternativa' } })}
                                                                            />
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <Form.Check
                                                                                type="checkbox"
                                                                                label="Correta"
                                                                                checked={alternativa.resultadoAlternativa}
                                                                                onChange={(e) => handleAlternativaChange(atividadeIndex, exerIndex, index, { target: { checked: e.target.checked, name: 'resultado' } })}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Form.Group>
                                                            ))}
                                                            <br />
                                                            <Button variant="secondary" onClick={() => handleAddAlternativa(atividadeIndex)}>
                                                                Adicionar Alternativa
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                            <div style={{ float: 'right' }}>
                                <br />
                                <Button variant="success" onClick={handleSaveEditAtividade}>
                                    Salvar Atividade
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>


            {/* Modal de Exclusão */}
            <Modal
                show={modalDeleteShow}
                onHide={() => setModalDeleteShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza de que deseja excluir esta atividade?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalDeleteShow(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAtividade}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Tabela das Atividades */}
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nome do grupo</th>
                        <th>Descrição</th>
                        <th>Grupo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {atividades.map((atividade) => (
                        <tr key={atividade._id}>
                            <td>
                                <Image
                                    width="50"
                                    height="50"
                                    src={`${atividade.imagem}${tokenMidia}`}
                                    alt="Imagem da atividade"
                                    thumbnail
                                />
                            </td>
                            <td>{atividade.nomeGrupo}</td>
                        <td style={{ maxWidth: '30vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{atividade.descricao}</td>
                        <td>{`${atividade.dominio.join(", ")} ${atividade.nivelDaAtividade} ano(s)`}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleEditAtividade(atividade._id)}>✏</Button>{' '}
                                <Button variant="danger" onClick={() => {
                                    setActivityToDelete(atividade._id);
                                    setModalDeleteShow(true);
                                }}>❌</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
