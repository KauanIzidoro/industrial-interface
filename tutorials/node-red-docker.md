# Node-RED running under Docker 

[reference](https://nodered.org/docs/getting-started/docker)


### Quick Start

To run in `Docker` in its simplest form just run:

```shell
docker run -it -p 1880:1880 -v node_red_data:/data --name mynodered nodered/node-red
```

Let's dissect that command: 

```shell
   docker run              - run this container, initially building locally if necessary

  -it                     - attach a terminal session so we can see what is going on

  -p 1880:1880            - connect local port 1880 to the exposed internal port 1880
    
  -v node_red_data:/data  - mount a docker named volume called `node_red_data` to the container /data directory so any changes made to flows are persisted
    
  --name mynodered        - give this machine a friendly local name
  
   nodered/node-red        - the image to base it on - currently Node-RED v1.2.0
```


Running that command should give a terminal  window with a running instance of `Node-RED`:

```shell 
Welcome to Node-RED
    ===================

    10 Oct 12:57:10 - [info] Node-RED version: v1.2.0
    10 Oct 12:57:10 - [info] Node.js  version: v10.22.1
    10 Oct 12:57:10 - [info] Linux 4.19.76-linuxkit x64 LE
    10 Oct 12:57:11 - [info] Loading palette nodes
    10 Oct 12:57:16 - [info] Settings file  : /data/settings.js
    10 Oct 12:57:16 - [info] Context store  : 'default' [module=memory]
    10 Oct 12:57:16 - [info] User directory : /data
    10 Oct 12:57:16 - [warn] Projects disabled : editorTheme.projects.enabled=false
    10 Oct 12:57:16 - [info] Flows file     : /data/flows.json
    10 Oct 12:57:16 - [info] Creating new flow file
    10 Oct 12:57:17 - [warn]

    ---------------------------------------------------------------------
    Your flow credentials file is encrypted using a system-generated key.

    If the system-generated key is lost for any reason, your credentials
    file will not be recoverable, you will have to delete it and re-enter
    your credentials.

    You should set your own key using the 'credentialSecret' option in
    your settings file. Node-RED will then re-encrypt your credentials
    file using your chosen key the next time you deploy a change.
    ---------------------------------------------------------------------

    10 Oct 12:57:17 - [info] Starting flows
    10 Oct 12:57:17 - [info] Started flows
    10 Oct 12:57:17 - [info] Server now running at http://127.0.0.1:1880/
```

### Acces your Node-RED instance:

For access your Node-RED instance, you can use a web browser to navigate to `http://localhost:1880`

