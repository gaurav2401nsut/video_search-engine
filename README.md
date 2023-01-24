# **Docker** 


## Experience
   ### Installation
   I followed  the docker official documenation

   [Docker Documentaion](https://docs.docker.com/get-started/overview/)

   *Dockerfile*



    FROM node:18 AS build
    WORKDIR /app
    COPY package* yarn.lock ./
    RUN yarn install
    COPY public ./public
    COPY src ./src
    RUN yarn build
    FROM nginx:alpine
    COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
    RUN rm -rf /usr/share/nginx/html/*
    COPY --from=build /app/build /usr/share/nginx/html
    EXPOSE 3000 3000
    ENTRYPOINT ["nginx", "-g", "daemon off;"]



   ### Using Docker
   
   - After a thorough study of materials available on docker including documentation, I was able to get a brief understanding of docker and as well as the importance of its applications.

  - I found the docker documentations well written and beginner friendly.

  - Following the getting started steps of docker ,i was able to get a clear sense of how to dockerize my react app .

 - By following the example given in the getting started section ,I developed a basic docker file for my app .
   - In my docker file ,i used base image of alpine and WORKDIR command was used to set the working directory for all the subsequent docker file instructions using *copy* command.
    - I copied my root app directory available at source path to destination path .


- To avoid docker form copying node modules and build folders ,a *dockerignore* file was used 
node package manager(npm) install was run to install the dependencies modules inside docker container .
- Build script defined in package.json was executed by using the command 
npm run build and the build files were collected in build folder.
- Node environment variable was changed to production to indicate production build .

- 3000 port of container was exposed by the docker expose command so that we will be able to map our host port to container exposed port .

- To statically serve the build folder npx serve command was used which was specified as an instruction to be executed when the docker container start by using the docker command cmd .
- Resulting docker file was used to build a docker image with a tag name by executing docker build command 
```docker
docker build -t video-search-Engine 
docker run -dp 3000:3000 video-search-Engine
```
- on my integrated terminal ,the build docker image was further analysed in the gui  provided by docker desktop where **i found that the image utilized significant storage space moreover time taken to build the docker image was quite high.**

## optimisation
- Docker uses a layered architecture where current layer is built on previous layer
 docker intrinsically perform caching where the output of a layer is cached and is used if the layers leading upto that layer are not changed .
- To take advantage of caching behaviour *package.json* was copied first so that node modules didn't have to reinstalled on changes in our app's source code .

- Even public and src folders were copied in different instructions, to take advantage of caching ,like before app was buiild for production however since we are not using server side rendering ,we don't need a node environment so **i decided to use multi stage build to reduce the image size ,the build folder from the previous stage was copied to my next stage which used nginx as a base image** ,the nginx server provided in the next stage was used to statically served the production code .
- Using multistage build and properly utilising layer caching both the image build time and image size were brought down significantly 

 # Troubleshootings
 To optimize the installations of node modules we used yarn but the following error was observed 

1.
 >"yarn.ps1 cannot be loaded because running scripts is disabled on this system"

 To resolve this error the folllowing command was executed on my windows powershell 
 ```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

2.
 >Error message "error:0308010C:digital envelope routines::unsupported"

During yarn build the above error was observed and to resolve  this error i had to change my package.json In your package.json: 

```json
"start": "react-scripts start"
```
```json
"start": "react-scripts --openssl-legacy-provider start"
```



## Applications of Docker

- Portable deployment of applications

- Support for automatic building of docker images
- Built-in version tracking
- Registry for sharing images
- A growing tools ecosystem from the docker API
Consistency among different environments
Efficient utilisation of resources