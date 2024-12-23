import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Row, Image, Dropdown } from 'react-bootstrap';
import { api } from '../utils/api';

const IMAGE_URL = 'https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg';
const tokenMidia = '?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D';

const fixedProfessional = {
  idDoProfissional: '672243e4effa46003373d4f4',
  nome: 'Stimular',
};

class UsuariosCadastrados extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: [],
      showModal: false,
      showModalEdit: false,
      showModalDelete: false,
      userIdToInactivate: null,
      selectedUser: this.getInitialUserState(),
      searchQuery: '',
      filterTipoDeConta: 'Todos',
      selectedFile: null,
    };
  }

  getInitialUserState = () => ({
    email: '',
    nome: '',
    telefone: '',
    dataDeNascimento: '',
    senha: 'stimular2024@',
    confirmarSenha: 'stimular2024@',
    tipoDeConta: 'Paciente',
    grupo: [],
    foto: IMAGE_URL,
    profissional: [],
    validade: this.calculateValidity('Paciente'),
    moeda: { valor: 1, dataDeCriacao: new Date() },
    nivel: 0,
    ativo: true,
    conquistas: [
      {
        nome: 'Beta',
        imagem: 'https://stimularmidias.blob.core.windows.net/midias/robo',
        descricao: 'Concluiu o teste',
        condicao: 0,
      },
      {
        nome: 'Bem vindo!',
        imagem: IMAGE_URL,
        descricao: 'Concluiu o cadastro',
        condicao: 0,
      },
      {
        nome: 'Descobri!',
        imagem: 'https://stimularmidias.blob.core.windows.net/midias/54bb0ad7-70a9-405c-85b4-626033aaea81.png',
        descricao: 'Concluiu o teste',
        condicao: 0,
      },
    ],
  });

  calculateValidity = (tipoDeConta) => {
    return tipoDeConta === 'Admin' || tipoDeConta === 'Profissional'
      ? '31/12/2999'
      : new Date().toLocaleDateString('pt-BR');
  };

  componentDidMount() {
    this.buscarUsuarios();
  }

  buscarUsuarios = () => {
    const { token } = this.props;
    fetch(`${api}/user-ativos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((dados) => {
      this.setState({ usuarios: dados.users });
    });
  };

  tornarUsuarioInativo = async (id) => {
    const { token } = this.props;
    const response = await fetch(`${api}/usuario/status/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ativo: false }),
    });
    if (response.ok) {
      this.buscarUsuarios();
      alert('Usuário tornado inativo com sucesso');
    } else {
      alert('Erro ao atualizar o status');
    }
  };

  handleShowModal = (id) => {
    this.setState({ showModal: true, userIdToInactivate: id });
  };

  handleShowDeleteModal = (id) => {
    this.setState({ showModalDelete: true, userIdToDelete: id });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      showModalEdit: false,
      showModalDelete: false,
      userIdToInactivate: null,
      selectedUser: this.getInitialUserState(),
      selectedFile: null,
      userIdToDelete: null,
    });
  };

  handleInputChange = (field, value) => {
    this.setState((prevState) => {
      let updatedGroup = prevState.selectedUser.grupo; // Preserve current group
      let updatedProfessional = prevState.selectedUser.profissional;
      let updatedValidity = prevState.selectedUser.validade;

      if (field === 'tipoDeConta') {
        if (value === 'Admin') {
          updatedGroup = ['Admin'];
        } else if (value === 'Profissional') {
          updatedProfessional = [fixedProfessional];
          updatedGroup = ['Profissional'];
        } else if (value === 'Paciente' && !updatedGroup.length) {
          updatedGroup = [];
        }
        updatedValidity = this.calculateValidity(value);
      }

      return {
        selectedUser: {
          ...prevState.selectedUser,
          [field]: value,
          grupo: updatedGroup,
          profissional: updatedProfessional,
          validade: updatedValidity,
        },
      };
    });
  };

  handleFileInputChange = async (file) => {
    if (!file) return;

    const userId = this.state.selectedUser._id;
    const uploadedUrl = await this.handleUploadFile('image', userId, file);
    if (uploadedUrl) {
      this.setState((prevState) => ({
        selectedUser: {
          ...prevState.selectedUser,
          foto: uploadedUrl,
        },
        selectedFile: file,
      }));
    }
  };

  handleUploadFile = async (type, id, file) => {
    if (!file) return null;

    const supportedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
    if (!supportedTypes.includes(file.type)) {
      console.error('Tipo de arquivo não suportado:', file.type);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    const { token } = this.props;
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

  formatDataDeNascimento = (value) => {
    const formattedValue = value.replace(/\D/g, '').slice(0, 8);
    let finalValue = formattedValue.slice(0, 2);
    if (formattedValue.length > 2) finalValue += `/${formattedValue.slice(2, 4)}`;
    if (formattedValue.length > 4) finalValue += `/${formattedValue.slice(4, 8)}`;
    return finalValue;
  };

  handleAddUser = async () => {
    const { selectedUser } = this.state;
    const { token } = this.props;

    selectedUser.dataDeNascimento = this.convertToDatabaseFormat(selectedUser.dataDeNascimento);
    selectedUser.foto = IMAGE_URL;

    const response = await fetch(`${api}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedUser),
    });

    if (response.ok) {
      this.handleCloseModal();
      this.buscarUsuarios();
    } else {
      console.error('Erro ao criar o usuário:', await response.text());
      alert('Falha ao salvar o usuário. Verifique os campos e tente novamente!');
    }
  };

  handleEditUser = (id) => {
    const user = this.state.usuarios.find((usuario) => usuario._id === id);
    this.setState({
      selectedUser: { 
        ...user, 
        dataDeNascimento: this.convertToDateInputFormat(user.dataDeNascimento) 
      },
      showModalEdit: true,
    });
  };

  handleSaveEditUser = async () => {
    const { selectedUser } = this.state;
    const { token } = this.props;

    const updatedUser = {
      ...selectedUser,
      dataDeNascimento: this.convertToDatabaseFormat(selectedUser.dataDeNascimento),
    };

    const response = await fetch(`${api}/user/${selectedUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      this.handleCloseModal();
      this.buscarUsuarios();
    } else {
      console.error('Erro ao editar o usuário:', await response.text());
      alert('Falha ao editar o usuário. Verifique os campos e tente novamente!');
    }
  };

  handleDeleteUsuario = async (id) => {
    const { token } = this.props;

    const response = await fetch(`${api}/usuario/status/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ativo: false }),
    });

    if (response.ok) {
      this.handleCloseModal();
      this.buscarUsuarios();
    } else {
      console.error('Erro ao excluir o usuário:', await response.text());
      alert('Falha ao excluir o usuário. Tente novamente!');
    }
  };

  convertToDateInputFormat = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    if (year && month && day) return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    return '';
  };

  convertToDatabaseFormat = (dateString) => {
    if (!dateString) return '';

    const [day, month, year] = dateString.split('/');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  renderTabela() {
    const { usuarios, searchQuery, filterTipoDeConta } = this.state;

    const filteredUsuarios = usuarios.filter((usuario) => {
      const query = searchQuery.toLowerCase();
      const matches =
        usuario.nome.toLowerCase().includes(query) ||
        usuario.email.toLowerCase().includes(query) ||
        usuario.telefone.includes(query) ||
        usuario.tipoDeConta.toLowerCase().includes(query) ||
        usuario.grupo.some((grupo) => grupo.toLowerCase().includes(query));

      const tipoDeContaMatches =
        filterTipoDeConta === 'Todos' || usuario.tipoDeConta === filterTipoDeConta;

      return matches && tipoDeContaMatches;
    });

    return (
      <div className="container mt-5">
        <h1>Todos os usuários</h1>
        <br/>
        <Row className="align-items-center mb-4">
          <Col xs="auto">
            <Button variant="success" onClick={() => this.setState({ showModal: true })}>
              Adicionar Usuário
            </Button>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Pesquisar..."
              value={this.state.searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
            />
          </Col>
          <Col xs="auto">
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                {this.state.filterTipoDeConta}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setState({ filterTipoDeConta: 'Todos' })}>
                  Todos
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ filterTipoDeConta: 'Paciente' })}>
                  Paciente
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ filterTipoDeConta: 'Profissional' })}>
                  Profissional
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ filterTipoDeConta: 'Admin' })}>
                  Admin
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Tipo de conta</th>
              <th>Grupo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>
                  <Image
                    src={`${usuario.foto || IMAGE_URL}${tokenMidia}`}
                    alt="Foto do usuário"
                    roundedCircle
                    width="50"
                    height="50"
                  />
                </td>
                <td>{usuario.nome}</td>
                <td>{usuario.tipoDeConta}</td>
                <td>{usuario.grupo.join(', ')}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => this.handleEditUser(usuario._id)}
                  >
                    ✏
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => this.handleShowDeleteModal(usuario._id)}
                  >
                    ❌
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {this.renderModals()}
      </div>
    );
  }

  renderModals() {
    return (
      <>
        <Modal show={this.state.showModal} onHide={this.handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.selectedUser.nome}
                      onChange={(e) => this.handleInputChange('nome', e.target.value)}
                      placeholder="Digite o nome"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={this.state.selectedUser.email}
                      onChange={(e) => this.handleInputChange('email', e.target.value)}
                      placeholder="Digite o email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      value={this.state.selectedUser.telefone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          this.handleInputChange('telefone', value);
                        }
                      }}
                      placeholder="Digite o telefone"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.selectedUser.dataDeNascimento}
                      placeholder="dd/mm/aaaa"
                      onChange={(e) => {
                        const formattedDate = this.formatDataDeNascimento(e.target.value);
                        this.handleInputChange('dataDeNascimento', formattedDate);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipo de Conta</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.selectedUser.tipoDeConta}
                      onChange={(e) => this.handleInputChange('tipoDeConta', e.target.value)}
                    >
                      <option value="Paciente">Paciente</option>
                      <option value="Profissional">Profissional</option>
                      <option value="Admin">Admin</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={this.handleAddUser}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showModalEdit} onHide={this.handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={12} className="text-center mb-4">
                  <Image
                    src={`${this.state.selectedUser.foto || IMAGE_URL}${tokenMidia}`}
                    alt="Preview de usuário"
                    thumbnail
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <Form.Group>
                    <Form.Label>Alterar Foto</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => this.handleFileInputChange(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.selectedUser.nome}
                      onChange={(e) => this.handleInputChange('nome', e.target.value)}
                      placeholder="Digite o nome"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={this.state.selectedUser.email}
                      onChange={(e) => this.handleInputChange('email', e.target.value)}
                      placeholder="Digite o email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      value={this.state.selectedUser.telefone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          this.handleInputChange('telefone', value);
                        }
                      }}
                      placeholder="Digite o telefone"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.selectedUser.dataDeNascimento}
                      placeholder="dd/mm/aaaa"
                      onChange={(e) => {
                        const formattedDate = this.formatDataDeNascimento(e.target.value);
                        this.handleInputChange('dataDeNascimento', formattedDate);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipo de Conta</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.selectedUser.tipoDeConta}
                      onChange={(e) => this.handleInputChange('tipoDeConta', e.target.value)}
                    >
                      <option value="Paciente">Paciente</option>
                      <option value="Profissional">Profissional</option>
                      <option value="Admin">Admin</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={this.handleSaveEditUser}>
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showModalDelete} onHide={this.handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Você tem certeza que deseja deletar este usuário?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => this.handleDeleteUsuario(this.state.userIdToDelete)}>
              Excluir
            </Button>
            <Button variant="success" onClick={this.handleCloseModal}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  render() {
    return <div>{this.renderTabela()}</div>;
  }
}

export default UsuariosCadastrados;
