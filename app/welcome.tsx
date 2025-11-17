import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay} />
        
        <Animated.View 
          style={[
            styles.content,
            { opacity: fadeAnim }
          ]}
        >
          {/* Ferry Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Ferry</Text>
          </View>
          
          <Text style={styles.title}>
            Bem-vindo a{'\n'}Ferry.ai
          </Text>
          
          <Text style={styles.subtitle}>
            Navegue de forma segura
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Comece agora</Text>
            <ArrowRight size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Já possui uma conta?{' '}
              <Text 
                style={styles.link}
                onPress={handleGetStarted}
              >
                Entrar
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 48,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ff5500ff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

// APENAS UM export default - remova o outro!
export default Welcome;