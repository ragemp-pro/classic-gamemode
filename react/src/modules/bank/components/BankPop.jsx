import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {popBank} from "../actions/action.bank";

class BankPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popMoney: '',
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.popMoney = this.popMoney.bind(this);
    }

    handleChange(e) {
        this.setState({ popMoney: e.target.value });
    }

    validateForm() {
        const { popMoney } = this.state;
        const { bank } = this.props;

        if (popMoney) {
            if (!isNaN(popMoney) && parseInt(popMoney) > 0) {
                if (bank.money >= parseInt(popMoney)) {
                    this.setState({ error: '' });
                    return true;
                } else {
                    this.setState({ error: 'Недостаточно денег на счете' });
                    return false;
                }
            } else {
                this.setState({ error: 'Некорректные данные' });
                return false;
            }
        } else {
            this.setState({ error: 'Поле не заполнено' });
            return false;
        }
    }

    popMoney() {
        const { popMoney } = this.state;
        const { popBank, closePage } = this.props;

        if (this.validateForm()) {
            popBank(parseInt(popMoney));
            closePage();
        }
    }

    render() {
        const { closePage } = this.props;
        const { popMoney, error } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Снятие средств со счета
                </div>

                <div className='push_block-bank-react'>
                    <div>Введите сумму снятия</div>
                    <div>
                        <input
                            className='input-bank-react'
                            value={popMoney}
                            style={{ borderColor: error && 'red' }}
                            onChange={this.handleChange}
                        />
                        <div className='button_input-bank-react' onClick={this.popMoney}>OK</div>
                    </div>

                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Назад
                        </button>
                    </div>

                    <div style={{ color: 'red', marginTop: '5%' }}>{ error }</div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    closePage: () => dispatch(closeBankPage()),
    popBank: money => dispatch(popBank(money))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankPop);