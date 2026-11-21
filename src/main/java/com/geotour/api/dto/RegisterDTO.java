package com.geotour.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Datos para registrar un nuevo usuario con rol ROLE_USER")
public record RegisterDTO(
        @Schema(
                description = "Nombre completo del usuario",
                example = "Jose Alonso Macias",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minLength = 3,
                maxLength = 150
        )
        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(min = 3, max = 150, message = "El nombre completo debe tener entre 3 y 150 caracteres")
        String nombreCompleto,

        @Schema(
                description = "Correo electronico unico del usuario",
                example = "usuario@geotour.com",
                requiredMode = Schema.RequiredMode.REQUIRED,
                maxLength = 150,
                format = "email"
        )
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato valido")
        @Size(max = 150, message = "El correo no puede superar los 150 caracteres")
        String correo,

        @Schema(
                description = "Contrasena de al menos 8 caracteres",
                example = "Admin1234!",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minLength = 8,
                maxLength = 72,
                format = "password"
        )
        @NotBlank(message = "La contrasena es obligatoria")
        @Size(min = 8, max = 72, message = "La contrasena debe tener entre 8 y 72 caracteres")
        String password
) {
}
