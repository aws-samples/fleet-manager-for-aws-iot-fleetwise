FROM --platform=linux/amd64 public.ecr.aws/lts/ubuntu:22.04 


RUN apt-get update && apt-get upgrade --fix-missing -y
RUN apt-get install nano -y \
    && apt-get install curl -y \
    && apt-get install unzip -y \
    && apt-get install apt-transport-https -y \
    && apt-get install can-utils -y

# vcan dependecies
RUN apt-get install wireguard-dkms wireguard-tools -y \
    && apt install iproute2 -y

RUN mkdir /app

COPY ./requirements.txt /app/requirements.txt
COPY ./resources /app/resources

WORKDIR /app

# install aws CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip /app/awscliv2.zip \
    && /app/aws/install
    
# install python3
RUN apt-get install -y python3
RUN python3 -V
RUN apt-get install -y python3-pip
RUN pip3 install -r /app/requirements.txt

ENTRYPOINT ["python3", "/app/resources/simulator.py" ]