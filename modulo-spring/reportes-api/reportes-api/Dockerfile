# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# --- ETAPA 2: EJECUCIÓN (RUN) ---
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Copiamos el JAR generado (el asterisco ayuda a que no importe el nombre exacto)
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]