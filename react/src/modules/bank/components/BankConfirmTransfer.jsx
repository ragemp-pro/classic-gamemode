import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {setArgsBank, setAskAnswerBank, setLoadingBank} from "../actions/action.bank";
import {closeBankPage} from "../actions/action.bankPages";

class BankConfirmTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    back() {
        const { closePage, setAskAnswer } = this.props;

        setAskAnswer(null);
        closePage();
    }

    transfer() {
        const { closePage, setArgs, setLoading, bank } = this.props;

        setArgs({ money: bank.askAnswer.money });
        setLoading(true);
    }

    render() {
        const { bank } = this.props;

        return (
            bank.askAnswer &&
            <Fragment>
                <div className='page_title-bank-react'>
                    Подтверждение перевода
                </div>

                <div className='push_block-bank-react'>
                    <div style={{ textAlign: 'left', fontSize: '80%', marginLeft: '-8%' }}>Информация</div>
                    <div className='info_block_confirm-bank-react'>
                        <div>Получатель: { bank.askAnswer.nick }</div>
                        <div>Номер счета: { bank.askAnswer.number }</div>
                        <div>Сумма перевода: { bank.askAnswer.money }$</div>
                    </div>
                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={this.back.bind(this)}>
                            Назад
                        </button>
                        <button className='button_panel-bank-react' onClick={this.transfer.bind(this)}>
                            Подтвердить
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    setAskAnswer: askAnswer => dispatch(setAskAnswerBank(askAnswer)),
    closePage: () => dispatch(closeBankPage()),
    setLoading: flag => dispatch(setLoadingBank(flag)),
    setArgs: args => dispatch(setArgsBank(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankConfirmTransfer);