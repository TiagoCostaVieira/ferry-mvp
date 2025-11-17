import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Moon, Ticket, Volume2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const Conta = () => {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [settings, setSettings] = useState({
    offlineTickets: true,
    soundAlerts: true,
    boardingNotifications: true,
    nightMode: isDark, // Sincronizar com o tema atual
  });

  const updateSetting = (key: keyof typeof settings) => {
    if (key === 'nightMode') {
      toggleTheme(); // Alternar o tema global
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Sincronizar o switch com o tema atual
  React.useEffect(() => {
    setSettings(prev => ({ ...prev, nightMode: isDark }));
  }, [isDark]);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditProfile = () => {
    alert('Funcionalidade de edição de perfil em desenvolvimento');
  };

  // Estilos dinâmicos baseados no tema
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
    },
    header: {
      backgroundColor: isDark ? '#1E1E1E' : '#000000',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 16,
    },
    profileCard: {
      backgroundColor: isDark ? '#2D2D2D' : '#F8F9FA',
      borderRadius: 16,
      padding: 24,
      gap: 20,
    },
    infoLabel: {
      fontSize: 14,
      color: isDark ? '#A0A0A0' : '#6B7280',
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#2D2D2D' : '#F8F9FA',
      borderRadius: 16,
      padding: 16,
    },
    settingText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      flex: 1,
    },
    iconColor: {
      color: isDark ? '#A0A0A0' : '#6B7280',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={dynamicStyles.headerTitle}>Configurações</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: dynamicStyles.container.backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Opções do Perfil</Text>
          
          <View style={dynamicStyles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.infoItem}>
                <Text style={dynamicStyles.infoLabel}>Nome:</Text>
                <Text style={dynamicStyles.infoValue}>Pedro Silva</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={dynamicStyles.infoLabel}>Email:</Text>
                <Text style={dynamicStyles.infoValue}>elementary221b@gmail.com</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Options */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Opções Gerais</Text>
          
          <View style={styles.settingsList}>
            {/* Salvar Bilhetes Offline */}
            <View style={dynamicStyles.settingItem}>
              <View style={styles.settingLeft}>
                <Ticket size={20} color={dynamicStyles.iconColor.color} />
                <Text style={dynamicStyles.settingText}>Salvar Bilhetes Offline</Text>
              </View>
              <Switch
                value={settings.offlineTickets}
                onValueChange={() => updateSetting("offlineTickets")}
                trackColor={{ false: '#767577', true: isDark ? '#81b0ff' : '#007AFF' }}
                thumbColor={settings.offlineTickets ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            {/* Alerta Sonoros de Embarque */}
            <View style={dynamicStyles.settingItem}>
              <View style={styles.settingLeft}>
                <Volume2 size={20} color={dynamicStyles.iconColor.color} />
                <Text style={dynamicStyles.settingText}>Alerta Sonoros de Embarque</Text>
              </View>
              <Switch
                value={settings.soundAlerts}
                onValueChange={() => updateSetting("soundAlerts")}
                trackColor={{ false: '#767577', true: isDark ? '#81b0ff' : '#007AFF' }}
                thumbColor={settings.soundAlerts ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            {/* Notificação de Embarque */}
            <View style={dynamicStyles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={dynamicStyles.iconColor.color} />
                <Text style={dynamicStyles.settingText}>Notificação de Embarque</Text>
              </View>
              <Switch
                value={settings.boardingNotifications}
                onValueChange={() => updateSetting("boardingNotifications")}
                trackColor={{ false: '#767577', true: isDark ? '#81b0ff' : '#007AFF' }}
                thumbColor={settings.boardingNotifications ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            {/* Modo Noturno */}
            <View style={dynamicStyles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={dynamicStyles.iconColor.color} />
                <Text style={dynamicStyles.settingText}>Modo Noturno</Text>
              </View>
              <Switch
                value={settings.nightMode}
                onValueChange={() => updateSetting("nightMode")}
                trackColor={{ false: '#767577', true: isDark ? '#81b0ff' : '#007AFF' }}
                thumbColor={settings.nightMode ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos estáticos que não mudam com o tema
const styles = StyleSheet.create({
  headerContent: {
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  profileInfo: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    color: '#ff8400ff',
    fontWeight: '600',
  },
  settingsList: {
    gap: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bottomSpace: {
    height: 40,
  },
});

export default Conta;