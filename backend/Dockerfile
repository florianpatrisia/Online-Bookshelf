# Use OpenJDK 21 base image
FROM openjdk:21-jdk

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
