## Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [Account](#account)
    * [Asset](#asset)
    * [Balance](#balance)
    * [Block](#block)
    * [Event](#event)
    * [Receipt](#receipt)
    * [Transaction](#transaction)
    * [Transfer](#transfer)
    * [Validator](#validator)
  * [Scalars](#scalars)
    * [Address](#address)
    * [Boolean](#boolean)
    * [Bytes](#bytes)
    * [Hash](#hash)
    * [Int](#int)
    * [String](#string)
    * [Timestamp](#timestamp)
    * [Uint64](#uint64)

</details>

### Query
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>asset</strong></td>
<td valign="top"><a href="#asset">Asset</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">assetId</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>assets</strong></td>
<td valign="top">[<a href="#asset">Asset</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>balances</strong></td>
<td valign="top">[<a href="#balance">Balance</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">address</td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#block">Block</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hash</td>
<td valign="top"><a href="#hash">Hash</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">height</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>blocks</strong></td>
<td valign="top">[<a href="#block">Block</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">Transaction</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">txHash</td>
<td valign="top"><a href="#hash">Hash</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactions</strong></td>
<td valign="top">[<a href="#transaction">Transaction</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">blockHeight</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transfer</strong></td>
<td valign="top"><a href="#transfer">Transfer</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">txHash</td>
<td valign="top"><a href="#hash">Hash</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transfers</strong></td>
<td valign="top">[<a href="#transfer">Transfer</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">asset</td>
<td valign="top"><a href="#hash">Hash</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">blockHeight</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">fromOrTo</td>
<td valign="top"><a href="#address">Address</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### Objects

#### Account

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>address</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
</tbody>
</table>

#### Asset

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>assetId</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>issuer</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The **full** name of this asset

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>precision</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>supply</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>symbol</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The **short** name of this asset

</td>
</tr>
</tbody>
</table>

#### Balance

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>address</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>asset</strong></td>
<td valign="top"><a href="#asset">Asset</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>balance</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

Uint64 balance

</td>
</tr>
</tbody>
</table>

#### Block

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>blockHash</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

The current block hash

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Block height

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>orderRoot</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

The ordered transactions Merkle root of a block

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>prevHash</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

The prev block hash

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>proofBitmap</strong></td>
<td valign="top"><a href="#bytes">Bytes</a>!</td>
<td>

The proof of a bitmap

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>proofRound</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

Proof of round

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>proofSignature</strong></td>
<td valign="top"><a href="#bytes">Bytes</a>!</td>
<td>

The proof of a signature for a block

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>proposer</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td>

The address of the proposer of a block

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stateRoot</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

The Merkle root of state root

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#timestamp">Timestamp</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactionsCount</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Show how many transactions in the block

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validators</strong></td>
<td valign="top">[<a href="#validator">Validator</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>validatorVersion</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

The version of validators

</td>
</tr>
</tbody>
</table>

#### Event

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Event payload, convenience for debug

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>service</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The event emitted from which service

</td>
</tr>
</tbody>
</table>

#### Receipt

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>cyclesUsed</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

Cycles used, similar to the `gasUsed` in eth

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isError</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

True when transaction receipt is error 

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ret</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Transaction response, is often a string in json format

</td>
</tr>
</tbody>
</table>

#### Transaction

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cyclesLimit</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

Cycles price, similar to the `gasLimit` in eth

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cyclesPrice</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td>

Cycles price, similar to the `gasPrice` in eth

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>method</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Represents what `method` does the transaction called 

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nonce</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

A random 32 bytes, the `nonce` in Muta is difference with Ethereum

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>order</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>payload</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Represents what `payload` of the transaction called method

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pubkey</strong></td>
<td valign="top"><a href="#bytes">Bytes</a>!</td>
<td>

Public key of of a transaction sender

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>receipt</strong></td>
<td valign="top"><a href="#receipt">Receipt</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>serviceName</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Represents what `service` does the transaction called 

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signature</strong></td>
<td valign="top"><a href="#bytes">Bytes</a>!</td>
<td>

Signature of a transaction

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>txHash</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td>

The transaction hash

</td>
</tr>
</tbody>
</table>

#### Transfer

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>asset</strong></td>
<td valign="top"><a href="#asset">Asset</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>block</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#timestamp">Timestamp</a>!</td>
<td>

A datetime string format as UTC string

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transaction</strong></td>
<td valign="top"><a href="#transaction">Transaction</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>txHash</strong></td>
<td valign="top"><a href="#hash">Hash</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#uint64">Uint64</a>!</td>
<td></td>
</tr>
</tbody>
</table>

#### Validator

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>address</strong></td>
<td valign="top"><a href="#address">Address</a>!</td>
<td>

A validator address

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>proposeWeight</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Propose weight of a validator

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>voteWeight</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Vote weight of a validator

</td>
</tr>
</tbody>
</table>

### Scalars

#### Address

The `Address` of an account, encoded to 40 length lowercase hex string

#### Boolean

The `Boolean` scalar type represents `true` or `false`.

#### Bytes

Bytes corresponding hex string

#### Hash

A 64 length lowercase hex string, the output digest of [keccak](https://en.wikipedia.org/wiki/SHA-3) hash function

#### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

#### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

#### Timestamp

Millisecond timestamp

#### Uint64

Uint64，encoded to a hex string 

