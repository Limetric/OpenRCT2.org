SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Structure `downloadFlavours`
--

CREATE TABLE `downloadFlavours` (
  `flavourId` int(11) UNSIGNED NOT NULL,
  `platform` enum('linux','macosx','windows') CHARACTER SET utf8 NOT NULL,
  `architecture` enum('x86','x86-64') CHARACTER SET utf8 NOT NULL,
  `identifier` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Content `downloadFlavours`
--

INSERT INTO `downloadFlavours` (`flavourId`, `platform`, `architecture`, `identifier`, `title`) VALUES
(1, 'windows', 'x86', 'portable', 'Portable ZIP'),
(2, 'windows', 'x86', 'installer', 'Installer'),
(3, 'linux', 'x86', '', ''),
(4, 'macosx', 'x86', '', ''),
(99, 'linux', 'x86', 'janisozaur-test', 'Janisozaur Test');

-- --------------------------------------------------------

--
-- Structure `downloads`
--

CREATE TABLE `downloads` (
  `downloadId` int(11) UNSIGNED NOT NULL,
  `version` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitHash` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gitBranch` enum('master','develop') COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `commits` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure `downloadsBuilds`
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

ALTER TABLE `downloadFlavours`
  ADD PRIMARY KEY (`flavourId`);

ALTER TABLE `downloads`
  ADD PRIMARY KEY (`downloadId`),
  ADD UNIQUE KEY `gitHash` (`gitHash`,`gitBranch`);

ALTER TABLE `downloadsBuilds`
  ADD PRIMARY KEY (`buildId`);

ALTER TABLE `downloadFlavours`
  MODIFY `flavourId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `downloads`
  MODIFY `downloadId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `downloadsBuilds`
  MODIFY `buildId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
