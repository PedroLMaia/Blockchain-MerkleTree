const SHA256 = require('crypto-js/sha256');
const MerkelTree = require("./MerkelTree");
const TransactionList = require("./TransactionList");
const Transaction = require("./Transaction");

let transactionList = new TransactionList();

class Block {
    constructor(index, timestamp, transacao, hashAnterior = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transacao = transacao;
        this.hashAnterior = hashAnterior;
        this.hash = this.calcularHash();
        this.nonce = 0;
    }

    calcularHash() {
        return SHA256(this.index + this.hashAnterior + this.timestamp + JSON.stringify(this.transacao) + this.nonce).toString();
    }
    minerarBloco(dificuldade){
        while(this.hash.substring(0, dificuldade) !== Array(dificuldade + 1).join('0')){
            this.nonce++;
            this.hash = this.calcularHash();
        }

        console.log("Bloco minerado: " + this.hash);
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.criaBlockGenesis()];
        this.dificuldade = 3;
    }

    criaBlockGenesis() {
        return new Block(0, "29/08/2022", "Bloco genesis", "0");
    }

    getUltimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.hashAnterior = this.getUltimoBlock().hash;
        newBlock.minerarBloco(this.dificuldade);
        this.chain.push(newBlock);
    }

    validacaoDeChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const blocoAtual = this.chain[i];
            const blocoAnterior = this.chain[i - 1];

            if (blocoAtual.hash !== blocoAtual.calcularHash() || blocoAtual.hashAnterior !== blocoAnterior.hash) {
                return "Invalida";
            }
        }
        return "Validada!";
    }
}

function transacao(){
    transactionList.list = [];
    
    for (let index = 0; index < 8; index++) {
        transactionList.add(new Transaction(Math.random(),Math.random(), Math.random()));
    }
    const tree = new MerkelTree();
    tree.createTree(transactionList.list);
    return tree;
}

let PedroCoin = new Blockchain();
console.log("\nMinerando bloco 1...")
PedroCoin.addBlock(new Block(1, "04/10/2022", transacao()));

console.log("\nMinerando bloco 2...")
PedroCoin.addBlock(new Block(2, "04/10/2022", transacao()));

console.log("\nMinerando bloco 3...")
PedroCoin.addBlock(new Block(3, "04/10/2022", transacao()));


console.log("\nMinerando bloco 4...")
PedroCoin.addBlock(new Block(4, "04/10/2022", transacao()));

console.log("\nMinerando bloco 5...")
PedroCoin.addBlock(new Block(5, "04/10/2022", transacao()));

console.log(JSON.stringify(PedroCoin, null, 2));
console.log("\nBlockChain valida? " +PedroCoin.validacaoDeChain() + "\n")

PedroCoin.chain[3].transacao = 3;
PedroCoin.chain[3].hash = PedroCoin.chain[3].calcularHash();

console.log(JSON.stringify(PedroCoin, null, 2));

console.log("\nBlockChain valida? " +PedroCoin.validacaoDeChain() + "\n")

