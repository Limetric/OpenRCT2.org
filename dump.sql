-- phpMyAdmin SQL Dump
-- version 4.5.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Gegenereerd op: 27 jan 2016 om 20:39
-- Serverversie: 5.6.27
-- PHP-versie: 7.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `openrct_org`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `downloadFlavours`
--

CREATE TABLE `downloadFlavours` (
  `flavourId` int(11) UNSIGNED NOT NULL,
  `platform` enum('unknown','windows','linux','osx') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `architecture` enum('x86','x86-64') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identifier` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `downloadFlavours`
--

INSERT INTO `downloadFlavours` (`flavourId`, `platform`, `architecture`, `identifier`, `name`) VALUES
(1, 'windows', 'x86', 'windows-x86-zip', 'Windows x86 Portable ZIP'),
(2, 'windows', 'x86', 'windows-x86', 'Windows x86 Installer'),
(3, 'osx', 'x86', 'osx-x86', 'Mac OS X x86'),
(4, 'linux', 'x86', 'linux-x86', 'Linux x86'),
(99, 'linux', 'x86', 'janisozaur-test', 'Janisozaur Test');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `downloads`
--

CREATE TABLE `downloads` (
  `downloadId` int(11) UNSIGNED NOT NULL,
  `version` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitHash` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gitHashShort` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitBranch` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `commits` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `downloadsBuilds`
--

CREATE TABLE `downloadsBuilds` (
  `buildId` int(11) UNSIGNED NOT NULL,
  `parentDownloadId` int(11) NOT NULL,
  `flavourId` int(11) NOT NULL,
  `status` enum('unknown','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `filePath` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int(11) UNSIGNED NOT NULL,
  `fileHash` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `buildLog` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `publisherKey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `downloadFlavours`
--
ALTER TABLE `downloadFlavours`
  ADD PRIMARY KEY (`flavourId`);

--
-- Indexen voor tabel `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`downloadId`),
  ADD UNIQUE KEY `gitHash` (`gitHash`,`gitBranch`);

--
-- Indexen voor tabel `downloadsBuilds`
--
ALTER TABLE `downloadsBuilds`
  ADD PRIMARY KEY (`buildId`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `downloadFlavours`
--
ALTER TABLE `downloadFlavours`
  MODIFY `flavourId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;
--
-- AUTO_INCREMENT voor een tabel `downloads`
--
ALTER TABLE `downloads`
  MODIFY `downloadId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;
--
-- AUTO_INCREMENT voor een tabel `downloadsBuilds`
--
ALTER TABLE `downloadsBuilds`
  MODIFY `buildId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
