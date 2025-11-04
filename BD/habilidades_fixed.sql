-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2025 a las 05:37:07
-- Versión del servidor: 12.0.2-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `habilidades_hunterxhunter`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habilidades_hunterxhunter`
--

CREATE TABLE `habilidades_hunterxhunter` (
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `personaje` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `habilidades_hunterxhunter`
--

INSERT INTO `habilidades_hunterxhunter` (`nombre`, `tipo`, `descripcion`, `personaje`) VALUES
('Agujas', 'Transformación', 'Illumi usa agujas para manipular personas.', 'Illumi Zoldyck'),
('Aura extrema', 'Especialista', 'Meruem posee un aura abrumadora.', 'Meruem'),
('Control remoto', 'Emisión', 'Shalnark controla personas con su antena.', 'Shalnark'),
('Doctor Blythe', 'Especialista', 'Neferpitou puede curar heridas graves.', 'Neferpitou'),
('Hilos de aura', 'Transformación', 'Machi manipula hilos de aura para atacar y curar.', 'Machi Komacine'),
('Pain Packer', 'Transformación', 'Feitan convierte el dolor en energía destructiva.', 'Feitan Portor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `habilidades_hunterxhunter`
--
ALTER TABLE `habilidades_hunterxhunter`
  ADD PRIMARY KEY (`nombre`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
