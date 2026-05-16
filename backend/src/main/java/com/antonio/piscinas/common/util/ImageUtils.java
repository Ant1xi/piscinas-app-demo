package com.antonio.piscinas.common.util;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public final class ImageUtils {

    private ImageUtils() {}

    /**
     * Redimensiona y comprime una imagen al guardarla en disco.
     * Mantiene la relación de aspecto. Siempre produce un JPEG.
     *
     * @param file       archivo recibido del cliente
     * @param destino    ruta de destino (debe tener extensión .jpg)
     * @param maxAncho   anchura máxima en píxeles
     * @param maxAlto    altura máxima en píxeles
     * @param calidad    calidad JPEG, entre 0.0 y 1.0
     */
    public static void procesarYGuardar(MultipartFile file, Path destino,
                                        int maxAncho, int maxAlto, double calidad) throws IOException {
        Thumbnails.of(file.getInputStream())
                .size(maxAncho, maxAlto)
                .outputFormat("JPEG")
                .outputQuality(calidad)
                .toFile(destino.toFile());
    }
}
