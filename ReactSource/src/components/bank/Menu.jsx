import React from 'react';
import {connect} from 'react-redux';
import { setPageBank, addPageBank, closePageBank } from '../../actions/bankPages.js';
import { closeForm, addForm } from '../../actions/forms.js';
import PayPush from './PayPush.jsx';
import PayPop from './PayPop.jsx';
import PayTransfer from './PayTransfer.jsx';
import PayNalog from './PayNalog.jsx';
import PayPhone from './PayPhone.jsx';
import PayCash from './PayCash.jsx';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colorCash: 'black',
            colorNal: 'black',
            colorPhone: 'black',
            colorPop: 'black',
            colorPush: 'black',
            colorTransfer: 'black'
        }

        this.getForm = this.getForm.bind(this)
    }

    mouseOut(event) {
        event.preventDefault();
        let id = event.target.id;
        console.log(id)

        switch(id) {
            case 'phone':
                this.setState({colorPhone: 'black'})
                break;
            case 'nalog':
                this.setState({colorNal: 'black'})
                break;
            case 'push':
                this.setState({colorPush: 'black'})
                break;
            case 'pop':
                this.setState({colorPop: 'black'})
                break;
            case 'transfer':
                this.setState({colorTransfer: 'black'})
                break;
            case 'cash':
                this.setState({colorCash: 'black'})
                break;
        }
    }

    mouseOver(event) {
        event.preventDefault();
        let id = event.target.id;

        switch(id) {
            case 'phone':
                this.setState({colorPhone: 'white'})
                break;
            case 'nalog':
                this.setState({colorNal: 'white'})
                break;
            case 'push':
                this.setState({colorPush: 'white'})
                break;
            case 'pop':
                this.setState({colorPop: 'white'})
                break;
            case 'transfer':
                this.setState({colorTransfer: 'white'})
                break;
            case 'cash':
                this.setState({colorCash: 'white'})
                break;
        }
    }

    pushMoney(event) {
        event.preventDefault();
        this.props.setPageBank(<PayPush 
            setPage={this.props.setPageBank} 
            addForm={this.props.addForm}
            closeForm={this.props.closeForm}
            bank={this.props.bank}
            />
        )
    }

    pushCashBox(event) {
        event.preventDefault();
        this.props.setPageBank(<PayCash 
            setPage={this.props.setPageBank} 
            addForm={this.props.addForm}
            bank={this.props.bank}
            info={this.props.info}
        />
        )
    }

    pushPhone(event) {
        event.preventDefault()
        this.props.setPageBank(<PayPhone 
            setPage={this.props.setPageBank} 
            money={this.props.bank.phoneMoney}
            addForm={this.props.addForm}
            bank={this.props.bank}
            isHave={this.props.info.isHave}
        />)
    }

    popMoney(event) {
        event.preventDefault()
        this.props.setPageBank(<PayPop 
            setPage={this.props.setPageBank}
            addForm={this.props.addForm}
            bank={this.props.bank}
        />)
    }

    transferMoney(event) {
        event.preventDefault()
        this.props.setPageBank(<PayTransfer 
            setPage={this.props.setPageBank}
            addForm={this.props.addForm}
            bank={this.props.bank}
        />)
    }

    payNalog(event) {
        event.preventDefault()
        this.props.setPageBank(<PayNalog 
            setPage={this.props.setPageBank}
            addForm={this.props.addForm}
            bank={this.props.bank}
            info={this.props.info}
        />)
    }

    exit(event) {
        event.preventDefault();
        this.props.closeForm();
    }

    getForm() {
        const { bank } = this.props;

        return(
            <div className='tableButtonsBank'>
                <div className='buttonBank' id='push'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.pushMoney.bind(this)}
                >
                    <div className='icoButtonBank' id='push'>
                        <svg id='push' xmlns="http://www.w3.org/2000/svg" width="83.575" height="81.905" viewBox="0 0 83.575 81.905" fill={this.state.colorPush}>
                            <g id="push" data-name="Group 47" transform="translate(0 0)">
                                <path id="push" data-name="Path 66" d="M208.57,60.356V56c1.5.107,2.059.793,2.573.793.643,0,.944-.815.944-1.222,0-1.051-2.059-1.5-3.517-1.544v-.579c0-.257-.322-.493-.643-.493a.566.566,0,0,0-.622.493v.622c-2.037.215-4.074,1.287-4.074,3.988,0,2.745,2.144,3.517,4.074,4.2V67.3c-2.187-.172-2.766-1.672-3.474-1.672-.536,0-.986.708-.986,1.222,0,1.051,1.8,2.487,4.46,2.53h0v.665a.566.566,0,0,0,.622.493c.322,0,.643-.236.643-.493v-.729a4.154,4.154,0,0,0,3.9-4.417C212.472,61.986,210.435,61.042,208.57,60.356Zm-1.137-.407c-1.136-.429-2.058-.879-2.058-2.1,0-1.115.858-1.651,2.058-1.8Zm1.008,7.311V62.736a2.507,2.507,0,0,1,1.887,2.4A2.039,2.039,0,0,1,208.441,67.26Z" transform="translate(-169.734 -45.149)"/>
                                <path id="push" data-name="Path 67" d="M80.382,48.651l-3.423-1.1a1.432,1.432,0,0,1-.924-.936,22.071,22.071,0,0,0-3.236-6.4,23.486,23.486,0,0,0-2.162-2.55,30.169,30.169,0,0,0,.744-6.889c-.051-3.1-.67-4.917-1.893-5.557-.659-.345-2.663-1.395-13.513,3.572a3.947,3.947,0,0,0-.719.428c-.731-.2-1.479-.378-2.231-.542-.091-.02-.184-.037-.275-.056a16.569,16.569,0,0,0,1.489-6.16,1.216,1.216,0,0,0-2.43-.109A14.152,14.152,0,0,1,42.55,35.007a35.272,35.272,0,0,0-9.79,0A14.163,14.163,0,1,1,50.314,15.345a1.216,1.216,0,0,0,2.173-1.094A16.6,16.6,0,1,0,28.845,35.789h0q-1.134.295-2.249.665a1.216,1.216,0,0,0,.771,2.307,32.641,32.641,0,0,1,20.572,0,1.216,1.216,0,0,0,.771-2.307q-1.113-.372-2.249-.665h0a16.585,16.585,0,0,0,5.049-4.936c.335.065.668.133,1,.2q.655.142,1.3.3c-.014.053-.027.106-.039.159a14.505,14.505,0,0,0,.114,7.4,8.806,8.806,0,0,0,3.225,4.534,10.232,10.232,0,0,0,5.987,1.9,8.026,8.026,0,0,0,3.88-.9,7.406,7.406,0,0,0,2.859-4.061q.526.614,1,1.257a19.639,19.639,0,0,1,2.88,5.7,3.868,3.868,0,0,0,2.5,2.523l3.423,1.1a2.154,2.154,0,0,1,1.5,2.058V58.7a2.154,2.154,0,0,1-1.5,2.058l-5.515,1.767a3.758,3.758,0,0,0-2.1,1.708A24.242,24.242,0,0,1,61.9,73.445a1.906,1.906,0,0,0-1,1.343L59.13,84.142a.547.547,0,0,1-.537.445H52.849a.547.547,0,0,1-.537-.445l-.978-5.169a1.911,1.911,0,0,0-2.173-1.537A50.845,50.845,0,0,1,41.584,78a48.493,48.493,0,0,1-5.574-.315A1.927,1.927,0,0,0,33.9,79.23l-.93,4.912a.547.547,0,0,1-.537.445H26.691a.548.548,0,0,1-.538-.449l-1.7-8.834a1.909,1.909,0,0,0-.981-1.328C15.711,69.833,11.609,62.911,11.609,53.96A23.382,23.382,0,0,1,14.55,42.072a21.221,21.221,0,0,1,7.905-7.718,1.216,1.216,0,0,0-1.218-2.106A23.151,23.151,0,0,0,9.489,49.543h0c-.117-.011-.234-.021-.351-.033a6.056,6.056,0,0,0-.446-2.427A4.982,4.982,0,0,0,5,43.858a3.361,3.361,0,0,0-3.165,1.41,3.2,3.2,0,0,0-.608,3.495c.613,1.262,2.187,2.155,4.8,2.717q-.108.161-.237.324a5.968,5.968,0,0,1-4.544,2.4A1.277,1.277,0,0,0,0,55.478v.006a1.274,1.274,0,0,0,1.22,1.27q.131.006.274.006c1.495,0,3.893-.551,6.2-3.441a6.937,6.937,0,0,0,.888-1.434q.344.039.661.068h0c-.041.659-.064,1.328-.064,2.008a25.065,25.065,0,0,0,3.588,13.423,24.59,24.59,0,0,0,9.346,8.624l1.654,8.589a2.981,2.981,0,0,0,2.927,2.425h5.744a2.981,2.981,0,0,0,2.927-2.425l.841-4.441a51.258,51.258,0,0,0,5.381.279,53.435,53.435,0,0,0,7.452-.519l.886,4.682a2.981,2.981,0,0,0,2.927,2.425h5.744a2.982,2.982,0,0,0,2.927-2.425l1.72-9.107A26.518,26.518,0,0,0,74.128,65.453a1.329,1.329,0,0,1,.739-.609l5.515-1.767A4.58,4.58,0,0,0,83.574,58.7V53.026A4.579,4.579,0,0,0,80.382,48.651ZM68.766,34.2c-.468,4-1.724,7.428-2.986,8.143a7.443,7.443,0,0,1-7.231-.849c-2.489-1.821-3.317-5.095-2.4-9.468h0A1.467,1.467,0,0,1,56.988,31c6.089-2.787,9.6-3.7,10.9-3.7a1.272,1.272,0,0,1,.441.059C68.725,27.782,69.238,30.156,68.766,34.2ZM3.415,47.7c-.126-.26.171-.716.36-.965a.97.97,0,0,1,.781-.475.914.914,0,0,1,.122.009A2.651,2.651,0,0,1,6.436,47.99a3.693,3.693,0,0,1,.254,1.147C5.007,48.789,3.7,48.286,3.415,47.7Z" transform="translate(0 -5.115)"/>
                                <path id="push" data-name="Path 68" d="M387.965,270.613a1.216,1.216,0,0,0-1.216,1.216,1.544,1.544,0,0,1-3.089,0,1.216,1.216,0,1,0-2.432,0,3.977,3.977,0,0,0,7.954,0A1.216,1.216,0,0,0,387.965,270.613Z" transform="translate(-319 -227.275)"/>
                            </g>
                        </svg>
                    </div>
                    <div className='textButtonBank' id='push'>Пополнить счет</div>
                </div>
                <div className='buttonBank' id='transfer'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.transferMoney.bind(this)}
                >
                    <div className='icoButtonBank' id='transfer'>
                        <svg id='transfer' xmlns="http://www.w3.org/2000/svg" width="76.189" height="76.183" viewBox="0 0 76.189 76.183" fill={this.state.colorTransfer}>
                            <g id="transfer" data-name="Group 51" transform="translate(0 -0.023)">
                                <path id="transfer" data-name="Path 93" d="M99.974,5.063H91.126a1.488,1.488,0,0,0-1.488,1.488V7.836H85.489A1.488,1.488,0,0,0,84,9.324v.428c-2.419-.211-3.214-.67-5.436-1.951a90.043,90.043,0,0,0-8.94-4.565l-.065-.028a12.66,12.66,0,0,0-9.717.153L53.855,5.506,48.807.459a1.488,1.488,0,0,0-2.1,0L30.132,17.03a1.476,1.476,0,0,0,0,2.1L58.448,47.451a1.608,1.608,0,0,0,2.1,0L75.681,32.322c.393.034.8.052,1.225.052,3.888,0,7.327-2.667,9.294-5.574H99.974a1.488,1.488,0,0,0,1.488-1.488V6.551A1.488,1.488,0,0,0,99.974,5.063ZM47.755,3.616l3.392,3.392a6.488,6.488,0,0,1-6.783,0ZM36.681,21.474l-3.392-3.392,3.392-3.392a6.488,6.488,0,0,1,0,6.783ZM59.5,44.294,56.11,40.9a6.479,6.479,0,0,1,6.782,0Zm5.535-5.535a9.456,9.456,0,0,0-11.07,0L38.824,23.618a9.457,9.457,0,0,0,0-11.071l3.4-3.4a9.457,9.457,0,0,0,11.071,0l3.219,3.219a5.9,5.9,0,0,0-4.428,3.244,8.481,8.481,0,1,0,9.752,10.5l5.024,1.705a9.5,9.5,0,0,0,1.576,7.542Zm-9.047-14.63.039.014L59,25.153a5.506,5.506,0,1,1-7.474-6.29A6.588,6.588,0,0,0,55.988,24.129Zm14.59,9.087a6.509,6.509,0,0,1-.951-3.095,11.571,11.571,0,0,0,2.624,1.421ZM84,24.719c-1.41,2.312-4.146,4.679-7.095,4.679a10.831,10.831,0,0,1-1.552-.109h-.006a8.523,8.523,0,0,1-5.512-3.016c-.03-.045-.16-.214-.179-.242a1.483,1.483,0,0,0-.82-.682L57.005,21.332c-1.888-.709-2.886-2.325-2.429-3.938v-.007a2.9,2.9,0,0,1,3.561-2l13.332,4.225a1.488,1.488,0,0,0,.9-2.837l-10.6-3.36-.093-.093,0,0-5.49-5.49L60.9,6.144l.051-.019.016-.006.06-.026a9.644,9.644,0,0,1,7.41-.126,86.2,86.2,0,0,1,8.64,4.413A13.392,13.392,0,0,0,84,12.734Zm5.637-.9H86.977V10.812h2.661Zm8.848,0H92.614V8.039h5.872Z" transform="translate(-25.272)"/>
                                <path id="transfer" data-name="Path 94" d="M342.2,124.7a1.448,1.448,0,0,0-.086-.28,1.41,1.41,0,0,0-.137-.256,1.446,1.446,0,0,0-.411-.411,1.51,1.51,0,0,0-.256-.137,1.482,1.482,0,0,0-.86-.085,1.4,1.4,0,0,0-.278.085,1.469,1.469,0,0,0-.257.137,1.445,1.445,0,0,0-.411.411,1.507,1.507,0,0,0-.137.256,1.444,1.444,0,0,0-.085.28,1.431,1.431,0,0,0,0,.58,1.4,1.4,0,0,0,.085.278,1.465,1.465,0,0,0,.137.257,1.445,1.445,0,0,0,.411.411,1.468,1.468,0,0,0,.257.137,1.5,1.5,0,0,0,.278.085,1.465,1.465,0,0,0,.29.03,1.492,1.492,0,0,0,.292-.03,1.575,1.575,0,0,0,.278-.085,1.509,1.509,0,0,0,.256-.137,1.446,1.446,0,0,0,.411-.411,1.374,1.374,0,0,0,.137-.257,1.4,1.4,0,0,0,.086-.278,1.5,1.5,0,0,0,0-.58Z" transform="translate(-288.767 -104.101)"/>
                                <path id="transfer" data-name="Path 95" d="M68.45,322.58l-.018-.044c-1.37-3.2-4.582-4.389-8.383-3.091l-10.367,2.867a6.8,6.8,0,0,0-4.208-4.144l-.039-.014-11.4-3.868a11.754,11.754,0,0,0-9.482-4.363c-3.888,0-7.327,2.667-9.294,5.574H1.488A1.488,1.488,0,0,0,0,316.984v18.761a1.488,1.488,0,0,0,1.488,1.488h8.848a1.488,1.488,0,0,0,1.488-1.488V334.46h4.149a1.488,1.488,0,0,0,1.488-1.488v-.428c2.419.211,3.214.67,5.436,1.951a90.061,90.061,0,0,0,8.94,4.565l.065.027a13.357,13.357,0,0,0,4.788.9,11.861,11.861,0,0,0,4.93-1.056l22.915-8.2c.041-.015.081-.031.12-.049C66.845,329.672,70.108,326.833,68.45,322.58Zm-59.6,11.677H2.976V318.472H8.848Zm5.637-2.773H11.824V318.472h2.661Zm48.981-3.534-22.9,8.2-.067.026-.06.026a9.645,9.645,0,0,1-7.411.126,86.186,86.186,0,0,1-8.64-4.413,13.393,13.393,0,0,0-6.922-2.355V317.576c1.411-2.312,4.146-4.678,7.095-4.678a8.587,8.587,0,0,1,7.285,3.422,1.488,1.488,0,0,0,.789.63l11.826,4.014c1.889.709,2.887,2.326,2.428,3.939a2.9,2.9,0,0,1-3.562,2L29.99,322.68a1.488,1.488,0,0,0-.9,2.837l13.355,4.232.043.013a5.841,5.841,0,0,0,4.467-.519,5.836,5.836,0,0,0,2.791-3.526q.051-.181.091-.362l11.173-3.1c1.614-.551,3.732-.75,4.675,1.422C66.663,326.233,64.125,327.636,63.466,327.95Z" transform="translate(0 -263.783)"/>
                                <path id="transfer" data-name="Path 96" d="M155.7,385.054a1.556,1.556,0,0,0-.085-.28,1.51,1.51,0,0,0-.137-.256,1.446,1.446,0,0,0-.411-.411,1.469,1.469,0,0,0-.257-.137,1.4,1.4,0,0,0-.278-.085,1.466,1.466,0,0,0-.58,0,1.441,1.441,0,0,0-.28.085,1.509,1.509,0,0,0-.256.137,1.487,1.487,0,0,0-.548.667,1.44,1.44,0,0,0-.085.28,1.429,1.429,0,0,0,0,.58,1.4,1.4,0,0,0,.085.278,1.375,1.375,0,0,0,.137.257,1.447,1.447,0,0,0,.411.411,1.5,1.5,0,0,0,.256.137,1.444,1.444,0,0,0,.28.085,1.428,1.428,0,0,0,.58,0,1.4,1.4,0,0,0,.278-.085,1.469,1.469,0,0,0,.257-.137,1.447,1.447,0,0,0,.411-.411,1.469,1.469,0,0,0,.137-.257,1.505,1.505,0,0,0,.085-.278,1.43,1.43,0,0,0,0-.58Z" transform="translate(-130.02 -326.716)"/>
                            </g>
                        </svg>
                    </div>
                    <div className='textButtonBank' id='transfer'>Перевести</div>
                </div>
                <div className='buttonBank' id='nalog'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.payNalog.bind(this)}
                >
                    <div className='icoButtonBank' id='nalog'>
                        <svg id='nalog' xmlns="http://www.w3.org/2000/svg" width="76.999" height="78.568" viewBox="0 0 76.999 78.568" fill={this.state.colorNal}>
                            <path id="nalog" data-name="Path 63" d="M1.535,21.7a3.179,3.179,0,0,0-.05.47v3.232A3.2,3.2,0,0,0,3.564,28.4v4.756a2.99,2.99,0,0,0,2.848,2.976V63.6a2.99,2.99,0,0,0-2.848,2.976v4.742A3.24,3.24,0,0,0,1.485,74.34V77.5a1.068,1.068,0,0,0,1.068,1.068H74.576A1.068,1.068,0,0,0,75.643,77.5V74.34a3.24,3.24,0,0,0-2.079-3.019v-4.77a2.99,2.99,0,0,0-2.848-2.976V36.129a2.99,2.99,0,0,0,2.848-2.976V28.4a3.2,3.2,0,0,0,2.079-2.991V22.2a3.1,3.1,0,0,0-.05-.47,1.063,1.063,0,0,0,.862-1.944L39.055.124a1.068,1.068,0,0,0-1,0L.659,19.76A1.068,1.068,0,0,0,1.535,21.7ZM5.7,30.248V28.6H18.017v1.631Zm27.425,5.888V63.6a2.99,2.99,0,0,0-2.848,2.976v4.542H20.138V66.579A2.99,2.99,0,0,0,17.29,63.6V36.129a2.99,2.99,0,0,0,2.848-2.976V28.6H30.262v4.543a2.991,2.991,0,0,0,2.848,2.983Zm-.712-5.888V28.6H44.73v1.631Zm27.425,5.888V63.6a2.991,2.991,0,0,0-2.848,2.976v4.542H46.851V66.579A2.991,2.991,0,0,0,44,63.6V36.129a2.99,2.99,0,0,0,2.848-2.976V28.6H56.975v4.543a2.99,2.99,0,0,0,2.848,2.983Zm-.712-5.888V28.6H71.443v1.631ZM71.443,69.491v1.63H59.111v-1.63Zm-26.713,0v1.63H32.4v-1.63ZM34.178,34.014h-.925a.854.854,0,0,1-.854-.854v-.776H44.715v.776a.854.854,0,0,1-.854.854Zm7.7,2.136V63.589H35.246V36.15Zm-7.7,29.575h9.683a.854.854,0,0,1,.854.854v.776H32.4v-.776a.854.854,0,0,1,.854-.854ZM18,69.491v1.63H5.685v-1.63ZM5.685,33.181v-.8H18v.776a.854.854,0,0,1-.855.854H6.518a.854.854,0,0,1-.833-.862Zm9.469,2.99V63.589H8.533V36.15ZM5.685,66.6a.854.854,0,0,1,.854-.855H17.148A.854.854,0,0,1,18,66.6v.776H5.685Zm67.822,7.782v2.093H3.607V74.383a1.1,1.1,0,0,1,1.1-1.1H72.4a1.1,1.1,0,0,1,1.1,1.082ZM71.429,66.6v.776H59.111V66.6a.854.854,0,0,1,.854-.855H70.6a.854.854,0,0,1,.833.833Zm-9.47-2.991V36.15h6.628V63.589Zm9.47-30.429a.854.854,0,0,1-.854.854h-10.6a.854.854,0,0,1-.854-.854v-.8H71.435ZM38.557,2.26l31.8,16.717H6.754ZM3.607,22.2a1.068,1.068,0,0,1,1.068-1.068H72.44A1.068,1.068,0,0,1,73.507,22.2v3.233A1.068,1.068,0,0,1,72.44,26.5H4.674a1.068,1.068,0,0,1-1.068-1.068Zm0,0" transform="translate(-0.089 -0.001)"/>
                        </svg>
                    </div>
                    <div className='textButtonBank' id='nalog'>Оплата налогов</div>
                </div>
                <div className='buttonBank' id='pop'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.popMoney.bind(this)}
                >
                    <div className='icoButtonBank' id='pop'>
                        <svg id='pop' xmlns="http://www.w3.org/2000/svg" width="75.858" height="76.627" viewBox="0 0 75.858 76.627" fill={this.state.colorPop}>
                            <path id="pop" data-name="Path 89" d="M77.539,35.7H73.862V18.784a7.361,7.361,0,0,0-7.353-7.353H61.53l-5.1-9.162a4.412,4.412,0,0,0-6-1.713L30.878,11.431H9.034a7.361,7.361,0,0,0-7.353,7.353v50.49a7.361,7.361,0,0,0,7.353,7.353H66.509a7.361,7.361,0,0,0,7.353-7.353V54.446h3.676V35.7ZM66.509,14.372a4.4,4.4,0,0,1,4.363,3.922H65.346l-2.18-3.922ZM51.865,3.126a1.5,1.5,0,0,1,2,.571l8.118,14.6H24.59ZM70.921,69.274a4.417,4.417,0,0,1-4.412,4.412H9.034a4.417,4.417,0,0,1-4.412-4.412V18.784a4.417,4.417,0,0,1,4.412-4.412H25.59l-7.053,3.922H9.953a1.471,1.471,0,1,0,0,2.941H70.921V35.7H60.167a9.07,9.07,0,0,0-9.059,9.059v.632a9.07,9.07,0,0,0,9.059,9.059H70.921V69.274ZM74.6,51.5H60.167a6.124,6.124,0,0,1-6.118-6.118v-.632a6.124,6.124,0,0,1,6.118-6.118H74.6Zm-9.927-6.313a3.247,3.247,0,1,1-3.247-3.247A3.246,3.246,0,0,1,64.671,45.192Z" transform="translate(-1.681)"/>
                        </svg>
                    </div>
                    <div id='pop' className='textButtonBank'>Снять со счета</div>
                </div>
                <div className='buttonBank' id='phone'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.pushPhone.bind(this)}
                >
                    <div className='icoButtonBank' id='phone'>
                        <svg id='phone' xmlns="http://www.w3.org/2000/svg" width="61.654" height="81.568" viewBox="0 0 61.654 81.568" fill={this.state.colorPhone}>
                            <g id="phone" data-name="Group 48" transform="translate(-7.324 0.001)">
                                <path id="phone" data-name="Path 70" d="M37.434,50a4.758,4.758,0,1,0,4.758,4.758A4.763,4.763,0,0,0,37.434,50Zm0,6.8a2.039,2.039,0,1,1,2.039-2.039A2.042,2.042,0,0,1,37.434,56.8Z" transform="translate(9.113 17.972)"/>
                                <path id="phone" data-name="Path 71" d="M42.114,39.875a5.438,5.438,0,1,0-5.438-5.438A5.443,5.443,0,0,0,42.114,39.875Zm0-8.157a2.719,2.719,0,1,1-2.719,2.719A2.722,2.722,0,0,1,42.114,31.718Z" transform="translate(10.551 10.424)"/>
                                <path id="phone" data-name="Path 72" d="M17.036,13.437a1.356,1.356,0,0,0,.961-.4l2.719-2.719A1.359,1.359,0,0,0,18.793,8.4l-2.719,2.719a1.359,1.359,0,0,0,.961,2.321Z" transform="translate(3.002 2.875)"/>
                                <path id="phone" data-name="Path 73" d="M68.978,40.44a4.448,4.448,0,0,0-1.312-3.166l-.757-.757a6.107,6.107,0,0,0-4.05-10.688,5.98,5.98,0,0,0-.734.054,5.981,5.981,0,0,0,.054-.734,6.125,6.125,0,0,0-6.118-6.118,5.981,5.981,0,0,0-.734.054,5.981,5.981,0,0,0,.054-.734,6.125,6.125,0,0,0-6.118-6.118,5.981,5.981,0,0,0-.734.054,5.981,5.981,0,0,0,.054-.734A6.107,6.107,0,0,0,37.9,7.5L36.817,6.425,31.7,1.309a4.481,4.481,0,0,0-6.332,0L8.632,18.047a4.487,4.487,0,0,0,0,6.334L13.747,29.5l6.675,6.675a6.082,6.082,0,0,0-.362,10.386,2.013,2.013,0,0,0,.309.329L34.992,61.453v2.442H32.273V81.567H67.618V63.894H64.9V59.775a11.5,11.5,0,0,0,1.99-15.393l.776-.776A4.448,4.448,0,0,0,68.978,40.44Zm-2.719-8.494a3.4,3.4,0,0,1-1.274,2.647L60.212,29.82a3.4,3.4,0,0,1,6.047,2.126Zm-6.8-6.8A3.4,3.4,0,0,1,58.188,27.8l-4.773-4.773a3.4,3.4,0,0,1,6.047,2.126Zm-6.8-6.8A3.4,3.4,0,0,1,51.391,21l-4.773-4.773a3.4,3.4,0,0,1,6.047,2.126Zm-10.2-10.2A3.395,3.395,0,0,1,44.593,14.2L39.82,9.428A3.4,3.4,0,0,1,42.469,8.156ZM10.554,22.46a1.764,1.764,0,0,1,0-2.489L27.292,3.233a1.3,1.3,0,0,1,.882-.443,1.707,1.707,0,0,1,.723,0,1.734,1.734,0,0,1,.3.06,1.764,1.764,0,0,1,.579.383l3.193,3.193L13.747,25.652ZM34.9,8.349l1.6,1.6,6.8,6.8.779.779,6.018,6.018.779.779,6.018,6.018.779.779,6.8,6.8L65.742,39.2a1.76,1.76,0,0,1,0,2.488l-.594.6h0L49.006,58.422a1.762,1.762,0,0,1-2.489,0L35.675,47.58h1.354a6.118,6.118,0,0,0,0-12.235H23.439l-7.771-7.771ZM22.7,38.148l.564-.064a1.165,1.165,0,0,1,.169-.02H37.029a3.4,3.4,0,1,1,0,6.8H23.435a3.4,3.4,0,0,1-.733-6.713Zm12.289,40.7V66.612H46.446a7.587,7.587,0,0,1,7.578,7.578v4.657Zm29.908,0H56.743V74.189a10.261,10.261,0,0,0-3.35-7.578H64.9Zm.034-32.507a8.8,8.8,0,0,1-2.212,11.7l-.541.408v5.45H37.709V60.2l-.48-.406c-.061-.053-.126-.1-.245-.19L24.917,47.578h6.913L44.593,60.343a4.485,4.485,0,0,0,6.334,0Z" transform="translate(0 0)"/>
                            </g>
                        </svg>
                    </div>
                    <div className='textButtonBank' id='phone'>Оплата связи</div>
                </div>
                <div className='buttonBank' id='cash'
                    onMouseOver={this.mouseOver.bind(this)}
                    onMouseOut={this.mouseOut.bind(this)}
                    onClick={this.pushCashBox.bind(this)}
                >
                    <div className='icoButtonBank' id='cash'>
                        <svg id="cash" data-name="Group 56" xmlns="http://www.w3.org/2000/svg" width="80.91" height="80.91" viewBox="0 0 80.91 80.91" fill={this.state.colorCash}>
                            <path id="cash" data-name="Path 115" d="M251.513,332.8h-2.7a1.348,1.348,0,1,0,0,2.7h2.7a1.348,1.348,0,1,0,0-2.7Z" transform="translate(-207.36 -280.208)"/>
                            <path id="cash" data-name="Path 116" d="M319.779,332.8h-2.7a1.348,1.348,0,1,0,0,2.7h2.7a1.348,1.348,0,1,0,0-2.7Z" transform="translate(-265.838 -280.208)"/>
                            <path id="cash" data-name="Path 117" d="M388.046,332.8h-2.7a1.348,1.348,0,1,0,0,2.7h2.7a1.348,1.348,0,1,0,0-2.7Z" transform="translate(-323.317 -280.208)"/>
                            <path id="cash" data-name="Path 118" d="M251.513,298.667h-2.7a1.348,1.348,0,0,0,0,2.7h2.7a1.348,1.348,0,1,0,0-2.7Z" transform="translate(-207.36 -251.469)"/>
                            <path id="cash" data-name="Path 119" d="M319.779,298.667h-2.7a1.348,1.348,0,1,0,0,2.7h2.7a1.348,1.348,0,0,0,0-2.7Z" transform="translate(-265.838 -251.469)"/>
                            <path id="cash" data-name="Path 120" d="M251.513,264.533h-2.7a1.348,1.348,0,0,0,0,2.7h2.7a1.348,1.348,0,0,0,0-2.7Z" transform="translate(-207.36 -222.729)"/>
                            <path id="cash" data-name="Path 121" d="M319.779,264.533h-2.7a1.348,1.348,0,0,0,0,2.7h2.7a1.348,1.348,0,0,0,0-2.7Z" transform="translate(-265.838 -222.729)"/>
                            <path id="cash" data-name="Path 122" d="M388.046,264.533h-2.7a1.348,1.348,0,0,0,0,2.7h2.7a1.348,1.348,0,1,0,0-2.7Z" transform="translate(-323.317 -222.729)"/>
                            <path id="cash" data-name="Path 123" d="M273.089,170.667H248.815a1.348,1.348,0,0,0-1.348,1.348v9.439a1.348,1.348,0,0,0,1.348,1.348h24.273a1.348,1.348,0,0,0,1.348-1.348v-9.439A1.348,1.348,0,0,0,273.089,170.667Zm-1.348,9.439H250.164v-6.743H271.74v6.743Z" transform="translate(-207.36 -143.697)"/>
                            <path id="cash" data-name="Path 124" d="M79.562,57.986H77.987L71.448,22.679a1.347,1.347,0,0,0-1.326-1.1H64.728V12.137h5.394a1.348,1.348,0,0,0,1.348-1.348V1.348A1.348,1.348,0,0,0,70.122,0H48.546A1.348,1.348,0,0,0,47.2,1.348v9.439a1.348,1.348,0,0,0,1.348,1.348H53.94v9.439H31.016v-2.7a1.348,1.348,0,0,0-1.348-1.348h-9.44a1.348,1.348,0,0,0-1.348,1.348v2.7H10.788a1.347,1.347,0,0,0-1.326,1.1L2.924,57.986H1.348A1.348,1.348,0,0,0,0,59.334V79.562A1.348,1.348,0,0,0,1.348,80.91H79.562a1.348,1.348,0,0,0,1.348-1.348V59.334A1.348,1.348,0,0,0,79.562,57.986ZM49.895,9.439V2.7H68.774V9.44H49.895Zm12.137,2.7v9.439H56.637V12.137ZM21.576,20.228h6.743V35.061H21.576V20.228ZM20.228,37.758h9.439a1.348,1.348,0,0,0,1.348-1.348V35.061h2.7v5.394H16.182V35.061h2.7V36.41A1.348,1.348,0,0,0,20.228,37.758ZM11.91,24.273h6.969v8.091H14.833a1.348,1.348,0,0,0-1.348,1.348V41.8a1.348,1.348,0,0,0,1.348,1.348H35.061A1.348,1.348,0,0,0,36.409,41.8V33.713a1.348,1.348,0,0,0-1.348-1.348H31.016V24.273H69l6.244,33.713H5.666Zm66.3,53.94H2.7V60.683H78.213V78.213Z"/>
                        </svg>
                    </div>
                    <div className='textButtonBank' id='cash'>Касса бизнеса</div>
                </div>
            </div>
        )
    }

    render() {
        return(
            <div>
                {this.getForm()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    forms: state.forms,
    bank: state.bank,
    info: state.phoneInfo
});

const mapDispatchToProps = dispatch => ({
    setPageBank: page => dispatch(setPageBank(page)),
    addPageBank: page => dispatch(addPageBank(page)),
    closePageBank: () => dispatch(closePageBank()),
    closeForm: () => dispatch(closeForm()),
    addForm: form => dispatch(addForm(form))
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)