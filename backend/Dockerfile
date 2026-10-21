```dockerfile
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src src

RUN ./mvnw -B clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/expense-tracker-backend-1.0.0.jar"]
```
