create table `Block` (
    `height` int comment 'The block height',
    `execHeight` int not null comment 'The executed block height',
    `blockHash` varchar(64) NOT NULL UNIQUE comment 'The block hash',
    `orderRoot` varchar(64) NOT NULL comment 'Merkle root of ordered transactions',
    `prevHash` varchar(64) NOT NULL comment 'Prev block hash',
    `proofBitmap` text not null comment 'Proofed bitmap',
    `proofRound` varchar(16) NOT NULL comment 'Round usage',
    `proofSignature` varchar(2048) NOT NULL comment 'Aggregated signature of validator set',
    `proposer` varchar(40) NOT NULL comment 'Address of the proposer',
    `stateRoot` varchar(64) NOT NULL comment 'State merkle root of the block',
    `timestamp` varchar(16) NOT NULL comment 'Block timestamp',
    `transactionsCount` int not null comment 'Number of transactions in the block',
    `validatorVersion` varchar(16) NOT NULL comment 'When the attributes of the validator set or the validator set change, the validatorVersion will change together'
);
alter table `Block`
add primary key `Block_pkey`(`height`);
create table `Transaction` (
    `block` int not null,
    `chainId` varchar(64) NOT NULL,
    `cyclesLimit` varchar(16) NOT NULL,
    `cyclesPrice` varchar(16) NOT NULL,
    `from` varchar(40) NOT NULL,
    `method` varchar(255) NOT NULL,
    `nonce` varchar(64) NOT NULL,
    `order` bigint unsigned not null auto_increment primary key,
    `payload` LONGTEXT NOT NULL,
    `pubkey` varchar(66) NOT NULL,
    `serviceName` varchar(255) NOT NULL,
    `signature` varchar(128) NOT NULL,
    `timeout` varchar(16) NOT NULL,
    `txHash` varchar(64) NOT NULL
);
alter table `Transaction`
add index `transaction_block_index`(`block`);
alter table `Transaction`
add index `transaction_txhash_index`(`txHash`);
create table `Receipt` (
    `id` bigint unsigned not null auto_increment primary key,
    `block` int not null,
    `cyclesUsed` varchar(16) NOT NULL,
    `isError` boolean not null,
    `ret` text not null,
    `txHash` varchar(64) NOT NULL
);
alter table `Receipt`
add unique `receipt_txhash_unique`(`txHash`);
create table `Event` (
    `data` text not null,
    `id` bigint unsigned not null auto_increment primary key,
    `txHash` varchar(64) NOT NULL,
    `service` varchar(255) NOT NULL
);
create table `BlockValidator` (
    `id` int unsigned not null auto_increment primary key,
    `address` varchar(40) NOT NULL,
    `proposeWeight` int not null,
    `version` varchar(16) NOT NULL comment 'This field will change when the validator changes',
    `voteWeight` int not null
);
alter table `BlockValidator`
add unique `blockvalidator_address_version_unique`(`address`, `version`);
create table `Account` (`address` varchar(40) NOT NULL);
alter table `Account`
add primary key `Account_pkey`(`address`);
create table `Asset` (
    `account` varchar(40) NOT NULL,
    `assetId` varchar(64) NOT NULL,
    `name` text not null,
    `supply` varchar(16) NOT NULL,
    `precision` int not null default '0',
    `symbol` text not null,
    `amount` text not null,
    `txHash` varchar(64) NOT NULL
);
create table `Transfer` (
    `asset` varchar(64) NOT NULL,
    `from` varchar(40) NOT NULL,
    `id` bigint unsigned not null auto_increment primary key,
    `to` varchar(40) NOT NULL,
    `txHash` varchar(64) NOT NULL,
    `value` varchar(16) NOT NULL comment 'original transfer value in hex',
    `amount` text not null comment 'transfer amount with precision',
    `block` int not null comment 'The block height',
    `timestamp` varchar(16) NOT NULL comment 'Block timestamp'
);
alter table `Transfer`
add index `transfer_asset_index`(`asset`);
alter table `Transfer`
add index `transfer_from_index`(`from`);
alter table `Transfer`
add index `transfer_to_index`(`to`);
alter table `Transfer`
add index `transfer_txhash_index`(`txHash`);
alter table `Transfer`
add index `transfer_block_index`(`block`);
create table `Balance` (
    `address` varchar(40) NOT NULL,
    `assetId` varchar(64) NOT NULL,
    `balance` varchar(16) NOT NULL,
    `id` bigint unsigned not null auto_increment primary key
);
alter table `Balance`
add index `balance_address_index`(`address`);
alter table `Balance`
add index `balance_assetid_index`(`assetId`);
alter table `Balance`
add unique `balance_address_assetid_unique`(`address`, `assetId`)