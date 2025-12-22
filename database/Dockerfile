FROM postgres:16-alpine
ENV POSTGRES_DB=cinetanger
ENV POSTGRES_USER=marouaneakrich
ENV POSTGRES_PASSWORD=20162016
COPY init.sql /docker-entrypoint-initdb.d/
COPY backup.sh /backup.sh
RUN chmod +x /backup.sh
