package com.snow.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
@ConditionalOnProperty(name = "snow.auth.token-validation-enabled", havingValue = "true", matchIfMissing = true)
public class FirebaseConfig {

    private static final String SERVICE_ACCOUNT_RESOURCE =
            "snow-angular-ui-firebase-adminsdk-fbsvc-73950f4e06.json";

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        String credentialsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
        try (InputStream credentials = openCredentials(credentialsPath)) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(credentials))
                    .build();

            return FirebaseApp.initializeApp(options);
        }
    }

    private static InputStream openCredentials(String credentialsPath) throws IOException {
        if (credentialsPath != null && !credentialsPath.isBlank()) {
            return new FileInputStream(credentialsPath);
        }

        ClassPathResource serviceAccount = new ClassPathResource(SERVICE_ACCOUNT_RESOURCE);
        if (serviceAccount.exists()) {
            return serviceAccount.getInputStream();
        }

        String encodedCredentials = System.getenv("FIREBASE_ADMINSDK");
        if (encodedCredentials != null && !encodedCredentials.isBlank()) {
            try {
                byte[] decodedCredentials = Base64.getDecoder().decode(encodedCredentials);
                return new ByteArrayInputStream(decodedCredentials);
            } catch (IllegalArgumentException exception) {
                throw new IllegalStateException(
                        "FIREBASE_ADMINSDK is not valid base64-encoded Firebase service-account JSON",
                        exception);
            }
        }

        throw new IllegalStateException(
                "Firebase credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_ADMINSDK, "
                        + "or provide classpath resource: " + SERVICE_ACCOUNT_RESOURCE);
    }
}
