import { useRouter } from 'expo-router';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Facebook,
    Instagram,
    Linkedin,
    Lock,
    Mail
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // Navega diretamente para as tabs
    router.replace('/(tabs)');
    
    // Opcional: Mostrar alerta de sucesso
    // Alert.alert(
    //   isLogin ? 'Login realizado!' : 'Conta criada!',
    //   'Bem-vindo ao Ferry'
    // );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo e Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Ferry</Text>
            </View>
            
            <Text style={styles.title}>
              {isLogin ? 'Entre no Ferry' : 'Cadastre-se no Ferry'}
            </Text>
            <Text style={styles.subtitle}>
              Personalize sua viagem
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="elementary221b@gmail.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="************"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? 
                    <EyeOff size={20} color="#666" /> : 
                    <Eye size={20} color="#666" />
                  }
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                Entrar
              </Text>
              <ArrowRight size={20} color="#FFFFFF" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Instagram size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Facebook size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Linkedin size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <Text 
                style={styles.footerLink}
                onPress={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Cadastre-se.' : 'Entre.'}
              </Text>
            </Text>
            
            {isLogin && (
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: '#ff5500ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    padding: 12,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  footerLink: {
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Auth;