/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
    View,
    PanResponder,
    Animated,
    StyleSheet,
    PixelRatio,
    Dimensions,
    TouchableWithoutFeedback,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

// Third party imports
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIconsIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import ZocialIcons from 'react-native-vector-icons/Zocial';
import SimpleLineIconsIcons from 'react-native-vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');

const iconSets = {
    EntypoIcons: EntypoIcons,
    EvilIconsIcons: EvilIconsIcons,
    FeatherIcons: FeatherIcons,
    FontAwesomeIcons: FontAwesomeIcons,
    FoundationIcons: FoundationIcons,
    IoniconsIcons: IoniconsIcons,
    MaterialIconsIcons: MaterialIconsIcons,
    MaterialCommunityIconsIcons: MaterialCommunityIconsIcons,
    OcticonsIcons: OcticonsIcons,
    ZocialIcons: ZocialIcons,
    SimpleLineIconsIcons: SimpleLineIconsIcons
}

export default class QuickBall extends Component {
    constructor(props) {
        super(props);

        const quickBallPosition = new Animated.ValueXY({ x: 0, y: 80 })
        this.dx = 0;
        this.dy = 0;

        this._panResponder = PanResponder.create({
            onMoveShouldSetResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (e, gestureState) => {
                if (!this.openQuickBall) {
                    quickBallPosition.setValue({x: this.dx + gestureState.dx, y: this.dy + gestureState.dy});
                }
            },
            
            onPanResponderRelease: (e, { dx, dy, moveX, moveY }) => {
                if (!this.openQuickBall) {
                    if (moveX > (width / 2)) {
                        this.dx = width - 50;
                        this.dy = moveY > height - 100 ? height - 150 : moveY < 100 ? 100 : Math.abs(moveY)
                        this.setState({
                            quickBallState: 'right'
                        });
                        Animated.spring(quickBallPosition, {
                            toValue: {
                                x: width - 50, 
                                y: moveY > height - 100 ? height - 150 : moveY < 100 ? 100 : Math.abs(moveY)
                            },
                        }).start()
                    } else if (moveX < (width / 2)) {
                        this.dx = 50;
                        this.dy = moveY > height - 100 ? height - 150 : moveY < 100 ? 100 : Math.abs(moveY)
                        this.setState({
                            quickBallState: 'left'
                        });
                        Animated.spring(quickBallPosition, {
                            toValue: {
                                x: 5, 
                                y: moveY > height - 100 ? height - 150 : moveY < 100 ? 100 : Math.abs(moveY) 
                            },
                        }).start()
                    }
                }
            },
        });

        this.state = { quickBallPosition, quickBallState: 'left' };

        this.increaseCenterCircleSize = new Animated.Value(10);
        this.buttonsOpacity = new Animated.Value(0);
        this.openQuickBall = false;
    }

    toggleQuickBall() {
        const createAnimation = function (value, toValue) {
            return Animated.spring(value, {
                toValue
            }).start();
        }

        if (this.openQuickBall) {
            this.openQuickBall = false;
            Animated.parallel([
                createAnimation(this.increaseCenterCircleSize, 10),
                createAnimation(this.buttonsOpacity, 0)
            ]).start();
            
        } else {
            this.openQuickBall = true;
            Animated.parallel([
                createAnimation(this.increaseCenterCircleSize, 40),
                createAnimation(this.buttonsOpacity, 1)
            ]).start();
        }        
    }

    render() {
        const { quickBallPosition, quickBallState } = this.state;
        const firstButtonTop = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , -15]
        });
        const firstButtonLeft = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , -10]
        });

        const secondButtonTop = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , 0]
        });
        const secondButtonLeft = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , -15]
        });

        const thirdButtonTop = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , 15]
        });        
        const thirdButtonLeft = this.increaseCenterCircleSize.interpolate({
            inputRange: [0, 10],
            outputRange: [0 , -10]
        });

        const buttonsOpacity = this.buttonsOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0 ,1]
        });

        const { 
            buttonsStyle, 
            quickBallStyle, 
            iconSet,
            iconsName,
            iconsSize,
            iconsColor,
            topButtonAction,
            centerButtonAction,
            bottomButtonAction
        } = this.props;

        const Icon = iconSets[iconSet];

        return (    
            <View style={styles.container}>
                <Animated.View style={quickBallPosition.getLayout()} {...this._panResponder.panHandlers}>
                    <TouchableWithoutFeedback onPress={() => topButtonAction()}>
                        <Animated.View style={[styles.buttonsStyle, buttonsStyle, 
                            {
                                left: quickBallState === 'right' ? firstButtonLeft : 50,
                                top: firstButtonTop,
                                opacity: buttonsOpacity
                            }]} 
                        >
                            <Icon name={iconsName[0]} size={iconsSize} color={iconsColor[0]} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => centerButtonAction()}>
                        <Animated.View style={[styles.buttonsStyle, buttonsStyle,
                            {
                                left: quickBallState === 'right' ? secondButtonLeft : 70,
                                top: secondButtonTop,
                                opacity: buttonsOpacity
                            }]} 
                        >
                            <Icon name={iconsName[1]} size={iconsSize} color={iconsColor[1]} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => bottomButtonAction()}>
                        <Animated.View style={[styles.buttonsStyle, buttonsStyle, 
                            {
                                left: quickBallState === 'right' ? thirdButtonLeft : 50,
                                top: thirdButtonTop,
                                opacity: buttonsOpacity
                            }]} 
                        >
                            <Icon name={iconsName[2]} size={iconsSize} color={iconsColor[2]} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                        
                    <TouchableWithoutFeedback onPress={() => this.toggleQuickBall()}>
                        <View style={[styles.quickballContainer, quickBallStyle]}>
                            <Animated.View style={[styles.centeralCircle, {
                                    width: this.increaseCenterCircleSize,
                                    height: this.increaseCenterCircleSize
                                }]} 
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    quickballContainer: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        overflow: 'visible',
        position: 'absolute',
        zIndex: 50
    },
    centeralCircle: {
        width: 25, 
        height: 25,
        borderRadius: 50,
        borderColor: '#FFFF',
        borderWidth: PixelRatio.get() / 2
    },
    buttonsStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#01B5F0',
        opacity: 1,
        position: 'absolute',
        zIndex: -1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

QuickBall.propTypes = {
    quickBallStyle: ViewPropTypes.style,
    buttonsStyle: ViewPropTypes.style, 
    iconSet: PropTypes.string.isRequired,
    iconsName: PropTypes.object,
    iconsSize: PropTypes.number,
    iconsColor: PropTypes.object,
    topButtonAction: PropTypes.object,
    centerButtonAction: PropTypes.object,
    bottomButtonAction: PropTypes.object,
};
  
QuickBall.defaultProps = {
    quickBallStyle: {},
    buttonsStyle: {},
    iconSet: 'FontAwesomeIcons',
    iconsName: ['wifi', 'bluetooth-b', 'camera'],
    iconsSize: 20,
    iconsColor: ['#fff', '#fff', '#fff'],
    topButtonAction: () => alert('topButtonAction clicked'),
    centerButtonAction: () => alert('centerButtonAction clicked'),
    bottomButtonAction: () => alert('bottomButtonAction clicked'),
};
