
# Configuração balança Chromatox

Passo a passo de como configurar o touchClient dentro do ambiente Chromatox.

## Identificação dos dados da Balança

### 1️⃣ Marca da Balança 
Trabalhamos atualmente com 2 marcas de balança, sendo elas:
- Sartorius
- Metler Toledo
Solicite a marca da balança para o usuário.

### 2️⃣ Identificação do número porta COM
Precisamos verificar no gerenciador de dispositivos qual porta COM a balança está conectada, para isso faça o seguinte:

- Abra a barra de pesquisa do Windows e digite:
```bash
  Gerenciador de Dispositivos ou Device Manager
```
- Amplie a seguinte opção:
```bash
  Portas (COM e LPT) ou Ports (COM e LPT)
```
- Identifique qual porta está sendo usada pela balança.

#### Exemplo:
![App Screenshot](https://i.postimg.cc/8zCpk30d/exemplo.png)

### 3️⃣ Número da estação
Solicite para o usuário qual o número da estação que ele se encontra.
Exemplo:
| Número da estação   | Nomenclatura       |
| :---------- | :--------- | 
| `Balança 4` | `BAL4` | 

## Configuração
### Arquivo config.properties 
Acessando o diretório (Caso não exista, faça a criação): 
```bash
  c:\Suporte\balanca
```
Possuimos um arquivo chamado (Caso não exista, faça a criação):
 ```bash
  config.properties
```
Esse arquivo passa dinamicamente informações necessarias para o touchClient funcionar corretamente. Sendo a estrutura do arquivo a seguinte: 

```bash
# Porta utilizada pelo servidor web
web_server_port=10000
# Porta utilizada pelo servidor web seguro
secure_web_server_port=10001
# Porta utilizada pelo servidor web legado
legacy_web_server_port=12000
# Habilita o recurso de abertura automática de visualizadores
enable_viewer_auto_open=true
# Habilita o recurso de edição de configuração diretamente no aplicativo
enable_configuration_editing=true
# Versão forçada da API a ser utilizada
api_version_override=
# Habilita a integração com o microfone Philips SpeechMike
enable_speechmike_integration=false
# Nome do scanner utilizado para a digitalização de documentos
scanner_name=
# Habilita a tela de digitalização do fabricante do scanner
enable_scanner_vendor_dialog=true
# Inicia automaticamente a operação de digitalização quando solicitado pelo navegador
enable_auto_scan=false
# Resolução padrão para o escaneamento
scanner_resolution=150.0
# Tipo de keystore utilizada para operações de assinatura digital (PKCS11 ou PKCS12)
ds_keystore_type=PKCS11
# Caminho para a biblioteca PKCS11 (assinatura digital)
ds_pkcs11_library=C:\Program Files (x86)\Oberthur Technologies\AWP\DLLs\OcsCryptolib_P11.dll
# Caminho para o arquivo PKCS12 (assinatura digital)
ds_pkcs12_file=C:\key.p12
# Dispositivo de Interfaceamento do LIS (Test | Sartorius | Metler Toledo)
interfacelis_device=Metler Toledo
# Código de identificação do dispositivo de Interfaceamento do LIS
interfacelis_device_code=BAL4
# Porta serial em que o dispositivo de Interfaceamento do LIS está conectada (Windows: COM1 | COM2...) (Linux: /dev/ttyACM0 | /dev/ttyACM1...)
interfacelis_device_serial_port=COM4
# Tempo de atraso (em milissegundos) para a leitura dos dados enviados pelo dispositivo na porta serial 
interfacelis_device_data_read_delay=500
# Tempo (em horas) da verificação periódica obrigatória dos dispositivos
interfacelis_validation_time=24
# Valor padrão que será utilizado no cálculo da verificação periódica dos dispositivos
interfacelis_validation_default_value=11.45
# Valor do desvio padrão que será utilizado no cálculo da verificação periódica dos dispositivos
interfacelis_validation_standard_deviation=1.45
# Configurações dos Dispositivos de Interfaceamento do LIS
interfacelis_devices_config=[{"code":"BAL4","name":"Metler Toledo","validationDate":1646056089915,"validationTimeInMilis":86400000,"defaultValue":11.45,"standardDeviation":1.45,"autoTare":true,"icon":"scale-balance","serialPort":"COM4","dataReadDelayInMillis":500}]

```
### Alteração de variáveis de config.properties
Será necessario alterar algumas variáveis do arquivo para o funcionamento correto do touchClient. 

Sendo essas alterações:

- Marca da Balança: **interfacelis_device (linha 29-30)**

```bash
# Dispositivo de Interfaceamento do LIS (Test | Sartorius | Metler Toledo)  
interfacelis_device= Metler Toledo(Marca da Balança)
```

- Número da estação: **interfacelis_device_code (linha 31-32)**

```bash
# Código de identificação do dispositivo de Interfaceamento do LIS
interfacelis_device_code= BAL4(Número da estação)
```

-  Porta COM: **interfacelis_device_serial_port (linha 33-34)**

```bash
# Porta serial em que o dispositivo de Interfaceamento do LIS está conectada (Windows: COM1 | COM2...) (Linux: /dev/ttyACM0 | /dev/ttyACM1...)
interfacelis_device_serial_port=COM4(Porta COM)
```

- Json com todos os dados acima: **interfacelis_devices_config (linha 41-45)**

```bash
# Valor do desvio padrão que será utilizado no cálculo da verificação periódica dos dispositivos
interfacelis_validation_standard_deviation=1.45
# Configurações dos Dispositivos de Interfaceamento do LIS
interfacelis_devices_config=[{"code":"BAL4" (Número da estação) ,"name":"Metler Toledo"  (Marca da Balança),"validationDate":1646056089915,"validationTimeInMilis":86400000,"defaultValue":11.45,"standardDeviation":1.45,"autoTare":true,"icon":"scale-balance","serialPort":"COM4"  (Porta COM),"dataReadDelayInMillis":500}]
```

- Após finalizado, salve o arquivo. (Caso tenha criado, salve no diretório: c:\Suporte\balanca).

## Configurando config.properties de forma global
O arquivo config.properties inicialmente deveria ser configurado manualmente para cada usuário no computador, porém podemos utilizar de um script padrão do windows para automatizar essa tarefa.

### Criação do arquivo .Bat
- Abra um bloco de notas e cole o seguinte script:
```bash
cd c:\Suporte\balanca
copy config.properties %userprofile%\appdata\Roaming\Touch\touch-client /Y
```
- Salve o arquivo na área de trabalho do usuário **Publico** com o nome de:
```bash
Config_Balança.bat
```

### Execução do .bat
Execute o arquivo **Config_Balança.bat** que acabamos de criar e verifique se o mesmo funcionou corretamente da seguinte forma:

- Pressione **Windows + R** e digite **%appdata%**, em seguida acesse esse caminho:
```bash
\Touch\touch-client
```
- Verifique se existe um arquivo **config.properties** no local
- Abra o mesmo e cheque se é o arquivo criado anteriormente, checando todas as variveis alteradas

## Validação
- Finalizado o procedimento solicite uma reinicialização da máquina e faça o seguinte.
- Após a reinicialização solicite um teste para o colaborador

## Sugestões
- Interessante solicitar que outro usuário acesse a máquina e teste o arquivo **Config_Balança.bat**.

- Validando que o mesmo está enviando corretamente o **config.properties** para o local correto.

- Caso deseje automatizar o .bat, é possível incluir o mesmo como uma tarefa no agendador de tarefas. Usando um gatilho de **login** do usuário.

## Suporte

Para suporte, mande um email para diego.salles.ext@dasa.com.br ou entre em contato via:

- [Diego Salles](https://www.linkedin.com/in/diego-salles-teixeira/)

