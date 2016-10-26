#!/bin/bash
sed -i 's/^mesg n$/tty -s \&\& mesg n/g' /root/.profile
echo ⚡ Update ubuntu ⚡
apt-get -qq update

echo ⚡ Install nginx ⚡
apt-get -qq -y install nginx
service nginx stop

echo ⚡ Create self-signed cert ⚡
mkdir /etc/nginx/ssl
cd /etc/nginx/ssl
openssl req \
  -new \
  -x509 \
  -nodes \
  -days 365 \
  -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/C=US/ST=CA/L=San Diego/O=Dis/CN=www.classy.org" \

echo ⚡ Replace nginx config ⚡
rm /etc/nginx/sites-available/default
cp /usr/share/nginx/nginx_vhost /etc/nginx/sites-available/default
rm -rf /usr/share/nginx/html

echo ⚡ Add public key ⚡
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

echo ⚡ Restart nginx ⚡
service nginx start

echo ⚡ Install node, npm, rabbitmq-server ⚡
apt-get -qq install -y node npm rabbitmq-server

echo ⚡ Set permissions on /usr/local ⚡
sudo chown -R vagrant /usr/local

echo ⚡ Switch to vagrant user ⚡
su vagrant << EOF

  echo ⚡ Install n to manage node versions ⚡
  npm i -g n

  echo ⚡ Add LTS node ⚡
  n lts
EOF
