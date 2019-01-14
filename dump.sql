SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `downloadFlavours` (
  `flavourId` int(11) UNSIGNED NOT NULL,
  `platform` enum('unknown','windows','linux','osx','android') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `architecture` enum('x86','x86-64','arm') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('unknown','stable','unstable','outdated','misc') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `identifier` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visibility` tinyint(1) NOT NULL DEFAULT '0',
  `indexVisibility` tinyint(1) NOT NULL DEFAULT '1',
  `iconFileName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prettyText` varchar(140) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryReason` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `downloadFlavours` (`flavourId`, `platform`, `architecture`, `category`, `identifier`, `name`, `visibility`, `indexVisibility`, `iconFileName`, `prettyText`, `categoryReason`) VALUES
(1, 'windows', 'x86', 'stable', 'windows-x86-zip', 'Windows x86 Portable ZIP', 1, 0, '', '', ''),
(2, 'windows', 'x86', 'stable', 'windows-x86', 'Windows x86 Installer', 1, 0, 'Windows8-52.png', 'Download installer for Windows', ''),
(3, 'osx', 'x86', 'stable', 'osx-x86_64', 'macOS', 1, 1, 'Mac-OS-52.png', 'Download for macOS', ''),
(4, 'linux', 'x86', 'stable', 'linux-x86', 'Linux x86', 1, 0, 'Linux-52.png', 'Download x86 for Linux', ''),
(5, 'windows', 'x86', 'misc', 'windows-x86-debug-symbols', 'Windows x86 Debug Symbols', 1, 0, '', '', 'Only needed when you are requested to.'),
(6, 'windows', 'x86-64', 'stable', 'windows-x64-zip', 'Windows x64 Portable ZIP', 0, 0, 'Windows8-52.png', '', ''),
(7, 'windows', 'x86-64', 'stable', 'windows-x64', 'Windows x64 Installer', 1, 1, 'Windows8-52.png', 'Download x64 for Windows', ''),
(8, 'osx', 'x86-64', 'unstable', 'osx-x64', 'macOS x64', 0, 0, 'Mac-OS-52.png', 'Download for macOS', 'Experimental build.'),
(9, 'linux', 'x86-64', 'stable', 'linux-x86_64', 'Linux x86_64', 1, 1, 'Linux-52.png', 'Download x86_64 for Linux', ''),
(10, 'windows', 'x86-64', 'misc', 'windows-x64-debug-symbols', 'Windows x64 Debug Symbols', 1, 0, '', '', 'Only needed when you are requested to.'),
(11, 'android', 'arm', 'unstable', 'android-arm', 'Android ARM and ARM64', 1, 0, 'Linux-52.png', 'Download ARM and ARM64 for Android', ''),
(12, 'android', 'x86', 'unstable', 'android-x86', 'Android X86 and X86_64', 1, 0, 'Linux-52.png', 'Download X86 and X86_64 for Android', ''),
(99, 'linux', 'x86', 'unknown', 'janisozaur-test', 'Janisozaur Test', 0, 0, '', '', '');

CREATE TABLE `downloads` (
  `downloadId` int(11) UNSIGNED NOT NULL,
  `version` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitHash` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gitHashShort` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitBranch` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `commits` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `downloadsBuilds` (
  `buildId` int(11) UNSIGNED NOT NULL,
  `parentDownloadId` int(11) NOT NULL,
  `flavourId` int(11) NOT NULL,
  `status` enum('unknown','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `filePath` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int(11) UNSIGNED DEFAULT NULL,
  `fileHash` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `buildLog` mediumtext COLLATE utf8mb4_unicode_ci,
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
  MODIFY `flavourId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

ALTER TABLE `downloads`
  MODIFY `downloadId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `downloadsBuilds`
  MODIFY `buildId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
