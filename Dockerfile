# create an image layer by layer
FROM node
# takes the image from which we build the container
WORKDIR /usr/app
# this changes so copy sends to this folder in the container instead of root
COPY package.json package-lock.json ./
# copy the local package.json files to the root directory of the container (least likely to change goes first)
RUN npm install
# installs the dependencies from the package.json
COPY . .
# if there is no dockerignore, all of the old node modules will be copied over -not a good idea!
# copies all of the files in the local directory into the app directory of the container
EXPOSE 9090
# this exposes port 9090 inside the container so that http://localhost:9090 routes the network traffic to the container
CMD ["npm","start"]
# use CMD to run the command, as an array, when the container has been created. There can be only one command, like an entry point in C#

# build with docker image build . in terminal

