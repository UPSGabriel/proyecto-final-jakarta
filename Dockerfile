# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
# Usamos una imagen con Maven y Java 17 para compilar tu código
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos todo tu código al contenedor
COPY . .

# Ejecutamos Maven para crear el archivo .war (saltando los tests para ir rápido)
RUN mvn clean package -DskipTests

# --- ETAPA 2: SERVIDOR (RUN) ---
# Usamos la imagen oficial de WildFly 30 (la misma versión que usas local)
FROM quay.io/wildfly/wildfly:30.0.0.Final

# 1. Descargamos el driver de PostgreSQL (El "chofer" para la base de datos)
USER root
RUN curl -L https://jdbc.postgresql.org/download/postgresql-42.7.2.jar -o /opt/jboss/wildfly/standalone/deployments/postgresql-42.7.2.jar
USER jboss

# 2. Copiamos el archivo .war que creamos en la Etapa 1
# OJO: Asegúrate que tu archivo en target se llame "proyectoFinal.war". 
# Si tu pom.xml genera otro nombre, ajusta esta línea.
COPY --from=build /app/target/proyectoFinal.war /opt/jboss/wildfly/standalone/deployments/

# 3. Copiamos el script setup.cli que creaste en el paso anterior
COPY setup.cli /opt/jboss/wildfly/bin/

# 4. Ejecutamos el script para configurar la conexión a Railway
RUN /opt/jboss/wildfly/bin/jboss-cli.sh --file=/opt/jboss/wildfly/bin/setup.cli

# 5. Exponemos el puerto 8080 y arrancamos el servidor
EXPOSE 8080
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]