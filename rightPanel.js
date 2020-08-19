import React from 'react';
import {
    Text,
    View,
    VrButton,
    Animated,
    asset,
    NativeModules
} from 'react-360';
import styles from './stylesheet';
import { connect, nextCrypto } from './store';

const { AudioModule } = NativeModules;

class RightPanel extends React.Component {

    state = {
      cryptoData: {
        symbol: '',
        algorithm: '',
        proofType: '',
        blockNumber: '',
        blockTime: '',
        blockReward: ''
      },
      fade: new Animated.Value(0),
      hover: false
    }
  
    fetchCryptoData(crypto) {
      fetch(
        `https://min-api.cryptocompare.com/data/coin/generalinfo?fsyms=${crypto}&tsym=NGN&api_key=8ebd127ca3552e3fb3951e3c3e23dcaf2e4ee09903a5b91011fc4c3b3aa3c1e7`
      ).then(
        response => response.json()
      ).then(
        data => this.setState({
          cryptoData: {
            symbol: data["Data"][0]["CoinInfo"]["Name"],
            algorithm: data["Data"][0]["CoinInfo"]["Algorithm"],
            proofType: data["Data"][0]["CoinInfo"]["ProofType"],
            blockNumber: data["Data"][0]["CoinInfo"]["BlockNumber"],
            blockTime: data["Data"][0]["CoinInfo"]["BlockTime"],
            blockReward: data["Data"][0]["CoinInfo"]["BlockReward"],
          }
        })
      )
    }
  
    componentDidMount() {
      this.fetchCryptoData(this.props.crypto);
      Animated.timing(
          this.state.fade,
          {
              toValue: 1,
              duration: 3000
          }
      ).start(); 
    }
  
    componentDidUpdate(prevProps) {
      if(prevProps.crypto != this.props.crypto) {
        this.fetchCryptoData(this.props.crypto);
      }
    }
  
    clickHandler(index) {
      nextCrypto(index);
      AudioModule.playOneShot({
          source: asset('audio/click.wav'),
          volume: 0.1
      });
    }
  
    render() {

        let { fade } = this.state;

      return (
         <Animated.View style={[styles.rightPanel, {opacity: fade,}]} >
           <View style={styles.header} >
             <Text style={styles.headerText} >
               Information
             </Text>
           </View>
           <View>
             <Text style={styles.textSize}>Symbol: {this.state.cryptoData.symbol} </Text>
             <Text style={styles.textSize}>Algorithm: {this.state.cryptoData.algorithm} </Text>
             <Text style={styles.textSize}>Proof Type: {this.state.cryptoData.proofType} </Text>
             <Text style={styles.textSize}>Block Number: {this.state.cryptoData.blockNumber} </Text>
             <Text style={styles.textSize}>Block Time: {this.state.cryptoData.blockTime} </Text>
             <Text style={styles.textSize}>Block Reward: {this.state.cryptoData.blockReward} </Text>
           </View>
           <View>
             <VrButton
              onEnter={ () => this.setState({hover: true})}
              onExit={ () => this.setState({hover: false})}
              style = { this.state.hover ? styles.hover : styles.button}
              onClick={() => this.clickHandler(this.props.index)} >
                  <Text style={styles.textSize} >
                      Next
                  </Text>
             </VrButton>
           </View>
         </Animated.View>
      );
    }
  }

  const ConnectedRightPanel = connect(RightPanel);

  export default ConnectedRightPanel;