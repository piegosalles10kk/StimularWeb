import React from "react";
import {Table, Button, Modal, Form, Col, Row, Image  } from "react-bootstrap";
import { api } from "../utils/api";

const tokenMidia = "?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D";

class UsuariosCadastrados extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: [],
      showModal: false,
      userIdToInactivate: null,
    };
  }

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

  tornarUsuarioInativo = (id) => {
    const { token } = this.props;
    fetch(`${api}/usuario/status/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          this.buscarUsuarios(); // Atualiza a lista de usuários
          alert(data.message); // Exibe um alerta para o usuário
        } else {
          console.error("Erro na atualização do status:", data);
          alert("Falha ao atualizar o status. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na conexão. Por favor, tente novamente.");
      });
  };

  handleShowModal = (id) => {
    this.setState({ showModal: true, userIdToInactivate: id });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, userIdToInactivate: null });
  };

  handleConfirmInactivate = () => {
    this.tornarUsuarioInativo(this.state.userIdToInactivate);
    this.handleCloseModal();
  };

  renderTabela(){
    return (
        <div>
          
  
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Tipo de conta</th>
                <th>Grupo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.usuarios.map((usuario, index) => (
                <tr key={index}>
                  <td>
                    <Image 
                      width="50"
                      height="50"
                      src={`${usuario.foto}${tokenMidia}`}
                      alt="Foto do usuário"
                      roundedCircle  
                    />
                  </td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.tipoDeConta}</td>
                  <td>{`${usuario.grupo} ${usuario.nivel} ano(s)`}</td>
                  <td>
                    <Button variant="primary">✏</Button>{" "}
                    <Button variant="danger" onClick={() => this.handleShowModal(usuario.id)}>
                      ❌
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
  
          <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>Você tem certeza que deseja deletar este usuário?</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={this.handleConfirmInactivate}>
                Excluir
              </Button>
              <Button variant="success" onClick={this.handleCloseModal}>
                Cancelar
              </Button>
              
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  

  render() {
    return (
        <div>
            {this.renderTabela()}
        </div>
    )
}
}

export default UsuariosCadastrados;
