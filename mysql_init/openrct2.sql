SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `changesets` (
  `versionName` varchar(200) NOT NULL,
  `changes` json DEFAULT NULL,
  `changesHash` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `releaseAssets` (
  `id` int UNSIGNED NOT NULL,
  `releaseId` int UNSIGNED NOT NULL,
  `fileHash` varchar(150) DEFAULT NULL,
  `fileSize` int UNSIGNED DEFAULT NULL,
  `fileName` varchar(200) NOT NULL,
  `url` varchar(300) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `releases` (
  `id` int UNSIGNED NOT NULL,
  `branch` varchar(50) NOT NULL,
  `commit` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  `versionName` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `version` varchar(150) NOT NULL,
  `published` timestamp NULL DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `changesets`
  ADD PRIMARY KEY (`versionName`);

ALTER TABLE `releaseAssets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `releaseId` (`releaseId`);

ALTER TABLE `releases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`,`branch`) USING BTREE,
  ADD KEY `branch` (`branch`,`published`);


ALTER TABLE `releaseAssets`
  ADD CONSTRAINT `releaseId` FOREIGN KEY (`releaseId`) REFERENCES `releases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
