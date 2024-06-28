import React, { createRef, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import igv from '../node_modules/igv/dist/igv.esm.js';

var igvStyle = {
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: '8px',
    border: '1px solid lightgray'
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to igv.js in React!</h1>
                </header>
                < Slect />
                <AppIgv />
            </div>
        );
    }
}

function Slect() {
}


class AppIgv extends Component {

    constructor(props) {
        super(props)
        // Declare reference object for the dom node that will contain the igv.js component
        this.container = createRef(null)
    }


    componentDidMount() {
        // Create the igv.js component.
        //const igvOptions = { genome: 'hg38', locus: 'BRCA1' };

        let tc_list = [
            {
                "name": "Refseq Genes",
                "format": "refgene",
                "id": "hg19_genes",
                "url": "test_ncbiRefSeq.txt.gz",
                "indexed": false,
                "order": 1000000,
                "infoURL": "https://www.ncbi.nlm.nih.gov/gene/?term=$$"
            }
        ];


        tc_list.push(
            {
                type: "alignment",
                format: "bam",
                name: "gs net",
                url: "gs://genomics-public-data/platinum-genomes/bam/NA12878_S1.bam",
                indexURL: "gs://genomics-public-data/platinum-genomes/bam/NA12878_S1.bam.bai",
            }
            ,
            {
                type: "alignment",
                format: "bam",
                name: "local_file",
                url: "http://localhost:8000/download?filename=N-T2406024T.final.sort.bam",
                indexURL: "http://localhost:8000/download?filename=N-T2406024T.final.sort.bam.bai",
            });

        const igvOptions = {
            reference: {
                "id": "hg19",
                "name": "Human 19 local",
                "fastaURL": "human_g1k_v37_decoy.fasta",
                "indexURL": "human_g1k_v37_decoy.fasta.fai",
                "cytobandURL": "est_cytoBand.txt",
                //"aliasURL": "https://s3.amazonaws.com/igv.org.genomes/hg19/hg19_alias.tab",
                "tracks": tc_list,
                "chromosomeOrder": "chr1,chr2,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY",

            },

            locus: "chr7:55259515-55259515" //EGFR L858R
        };
        return igv.createBrowser(this.container.current, igvOptions);

    }
    render() {
        // Return the div that will contain igv.js
        return (
            <div ref={this.container} style={igvStyle}></div>
        );
    }
}


export default App;
