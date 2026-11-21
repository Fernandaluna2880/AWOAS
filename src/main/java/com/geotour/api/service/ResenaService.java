package com.geotour.api.service;

import com.geotour.api.dto.ResenaDTO;
import com.geotour.api.dto.ResenaResponseDTO;
import com.geotour.api.entity.Destino;
import com.geotour.api.entity.Resena;
import com.geotour.api.entity.Usuario;
import com.geotour.api.exception.ConflictException;
import com.geotour.api.exception.ResourceNotFoundException;
import com.geotour.api.repository.DestinoRepository;
import com.geotour.api.repository.ResenaRepository;
import com.geotour.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;

    @Transactional
    public ResenaResponseDTO crear(Long destinoId, ResenaDTO dto, String correoUsuario) {
        Usuario usuario = findUsuario(correoUsuario);
        Destino destino = findDestino(destinoId);

        if (resenaRepository.existsByUsuario_IdAndDestino_Id(usuario.getId(), destino.getId())) {
            throw new ConflictException("El usuario ya registro una resena para este destino");
        }

        Resena resena = Resena.builder()
                .usuario(usuario)
                .destino(destino)
                .calificacion(dto.calificacion())
                .comentario(dto.comentario().trim())
                .build();

        return toResponse(resenaRepository.save(resena));
    }

    @Transactional(readOnly = true)
    public List<ResenaResponseDTO> listarPorDestino(Long destinoId) {
        findDestino(destinoId);

        return resenaRepository.findByDestino_IdOrderByIdDesc(destinoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void eliminar(Long id) {
        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resena no encontrada con id " + id
                ));

        resenaRepository.delete(resena);
    }

    private Usuario findUsuario(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con correo " + correo
                ));
    }

    private Destino findDestino(Long id) {
        return destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id " + id
                ));
    }

    private ResenaResponseDTO toResponse(Resena resena) {
        return new ResenaResponseDTO(
                resena.getId(),
                resena.getDestino().getId(),
                resena.getDestino().getNombre(),
                resena.getUsuario().getId(),
                resena.getUsuario().getNombreCompleto(),
                resena.getCalificacion(),
                resena.getComentario()
        );
    }
}
