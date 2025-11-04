-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2025 a las 05:37:46
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
-- Base de datos: `personajes_hunterxhunter`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personajes_hunterxhunter`
--

CREATE TABLE `personajes_hunterxhunter` (
  `nombre` varchar(100) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `altura` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `urlImagen` varchar(255) NOT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `habilidad` varchar(100) DEFAULT NULL,
  `origen` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `personajes_hunterxhunter`
--

INSERT INTO `personajes_hunterxhunter` (`nombre`, `edad`, `altura`, `peso`, `urlImagen`, `genero`, `descripcion`, `habilidad`, `origen`) VALUES
('Feitan Portor', 28, 155, 45, 'https://hxh-api.vercel.app/images/feitan.png', 'Masculino', 'Miembro de la Brigada Fantasma.', 'Pain Packer', 'Ciudad Meteoro'),
('Illumi Zoldyck', 24, 185, 68, 'https://hxh-api.vercel.app/images/illumi.png', 'Masculino', 'Hermano mayor de Killua.', 'Agujas', 'Montaña Kukuroo'),
('Machi Komacine', 24, 159, 48, 'https://hxh-api.vercel.app/images/machi.png', 'Femenino', 'Miembro de la Brigada Fantasma.', 'Hilos de aura', 'Ciudad Meteoro'),
('Meruem', 40, 175, 65, 'https://hxh-api.vercel.app/images/meruem.png', 'Masculino', 'Rey de las Hormigas Quimera.', 'Aura extrema', 'NGL'),
('Neferpitou', 17, 175, 60, 'https://hxh-api.vercel.app/images/pitou.png', 'Desconocido', 'Guardia real de Meruem.', 'Doctor Blythe', 'NGL'),
('Shalnark', 17, 170, 57, 'https://hxh-api.vercel.app/images/shalnark.png', 'Masculino', 'Miembro de la Brigada Fantasma.', 'Control remoto', 'Ciudad Meteoro');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `personajes_hunterxhunter`
--
ALTER TABLE `personajes_hunterxhunter`
  ADD PRIMARY KEY (`nombre`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
