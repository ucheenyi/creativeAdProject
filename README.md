# creativeAdProject
This Project contains files and Steps involved in building, deploying and Testing an HTTP nodeJS API.


Steps:

Step 1: Dockerising the NPM packaged app

Create a Dockerfile inside the App folder.
Note: the Dockerfile should not have any file extension

Step 2: Build the Image using the Dockerfile, see command below:

 docker build -t http-api-app .
Note: You will need to run the command above inside the folder path that contains both the Dockerfile and the other application folders/files

Step 3: Create an instance of the image(Container)

Run the command below:
docker run --name api-app -d -p 6000:6000 http-api-app
To see the created container(running instance) use the command below:
docker ps

Step 4: Tag the image and push to Dockerhub(hub.docker.com) so that anyone can use the image 
Use the command syntax below to tag and push the local image to dockerhub

docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname

In my case, I used the command below:
docker tag http-api-app:latest ucheenyi/api-app:v1
docker push ucheenyi/api-app:v1

Note: You will need to have an account on dockerhub to be able to push an image to your account.

Step 5: Deploy the image to Kubernetes:
Create a yaml file that contains the Deployment and the NodePort service that will expose the App
The yaml file is app.yaml

Use the command below to deploy the App to kubernetes

kubectl apply -f app.yaml

Use the commands below to monitor and test the deployment and the service
kubectl get deployment 
kubectl get service
kubectl get pod

After about a minute, the Status of the Pod should be "running"

I used katakoda Playground to deploy the app and tested it there and it was running.

