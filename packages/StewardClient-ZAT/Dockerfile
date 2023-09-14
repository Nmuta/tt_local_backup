FROM ruby:2.6.9

# Created by referencing
# - https://github.com/Pindar/docker-zat/blob/master/Dockerfile
# - https://developer.zendesk.com/documentation/apps/zendesk-app-tools-zat/installing-and-using-zat/#installing-zat
# - https://developer.zendesk.com/documentation/apps/zendesk-app-tools-zat/installing-and-using-zat/#testing-your-app-locally-in-a-browser

ENV LC_CTYPE en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
# ENV LC_ALL en_US.UTF-8
ENV RUBYOPT "-E utf-8"

RUN ruby -v
RUN gem install rake
RUN gem install nokogiri -v 1.13.10
RUN gem install zendesk_apps_tools

RUN zat -v

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs
EXPOSE 4567
WORKDIR /data