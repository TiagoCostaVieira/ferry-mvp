import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bike,
    Car,
    CheckCircle2,
    CreditCard,
    Lock,
    Shield,
    Truck
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Tipos
type VehicleType = {
  id: string;
  name: string;
  price: number;
  icon: any;
};

type PaymentMethod = 'credit' | 'pix' | 'debit';

const Payment = () => {
  const { ferryId } = useLocalSearchParams();
  const router = useRouter();
  
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ferry, setFerry] = useState<any>(null);

  const vehicleTypes: VehicleType[] = [
    { id: "motorcycle", name: "Moto", price: 25.0, icon: Bike },
    { id: "car", name: "Carro Passeio", price: 45.0, icon: Car },
    { id: "suv", name: "SUV", price: 65.0, icon: Car },
    { id: "truck", name: "Caminhões leves", price: 120.0, icon: Truck },
  ];

  const paymentMethods = [
    { id: 'credit' as PaymentMethod, name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit' as PaymentMethod, name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix' as PaymentMethod, name: 'PIX', icon: Shield },
  ];

  // Simular carregamento dos dados do ferry
  useEffect(() => {
    const fetchFerryData = async () => {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockFerry = {
        id: ferryId,
        name: "Ferry Cujupe 1",
        route: "Cujupe → São Luís",
        nextTrip: "14h20",
        boardingTime: "14:20",
        arrival: "15h05",
      };
      
      setFerry(mockFerry);
    };

    fetchFerryData();
  }, [ferryId]);

  const selectedVehicleData = vehicleTypes.find(v => v.id === selectedVehicle);
  const totalAmount = selectedVehicleData?.price || 0;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`.replace('.', ',');
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return match.slice(1).filter(Boolean).join(' ');
    }
    return text;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const validateForm = () => {
    if (!selectedVehicle) {
      Alert.alert('Erro', 'Selecione um tipo de veículo');
      return false;
    }

    if (paymentMethod !== 'pix') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Erro', 'Número do cartão inválido');
        return false;
      }
      if (!cardName) {
        Alert.alert('Erro', 'Nome no cartão é obrigatório');
        return false;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        Alert.alert('Erro', 'Data de validade inválida');
        return false;
      }
      if (!cvv || cvv.length !== 3) {
        Alert.alert('Erro', 'CVV inválido');
        return false;
      }
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular sucesso no pagamento
      Alert.alert(
        'Pagamento Aprovado!',
        `Bilhete para ${selectedVehicleData?.name} comprado com sucesso!`,
        [
          {
            text: 'Ver Bilhete',
            onPress: () => router.replace('/(tabs)/viagens')
          }
        ]
      );

    } catch (error) {
      Alert.alert('Erro', 'Falha no processamento do pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  if (!ferry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pagamento</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo da Viagem */}
        <View style={styles.tripSummary}>
          <Text style={styles.summaryTitle}>Resumo da Viagem</Text>
          <View style={styles.summaryDetails}>
            <Text style={styles.ferryName}>{ferry.name}</Text>
            <Text style={styles.route}>{ferry.route}</Text>
            <View style={styles.tripTimes}>
              <Text style={styles.timeText}>Embarque: {ferry.boardingTime}</Text>
              <Text style={styles.timeText}>Chegada: {ferry.arrival}</Text>
            </View>
          </View>
        </View>

        {/* Seleção de Veículo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Veículo</Text>
          <View style={styles.vehicleGrid}>
            {vehicleTypes.map((vehicle) => {
              const IconComponent = vehicle.icon;
              return (
                <TouchableOpacity
                  key={vehicle.id}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                  style={[
                    styles.vehicleButton,
                    selectedVehicle === vehicle.id && styles.vehicleButtonSelected
                  ]}
                >
                  <IconComponent 
                    size={24} 
                    color={selectedVehicle === vehicle.id ? "#007AFF" : "#6B7280"} 
                  />
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>
                    {formatCurrency(vehicle.price)}
                  </Text>
                  {selectedVehicle === vehicle.id && (
                    <CheckCircle2 size={16} color="#007AFF" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Método de Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pagamento</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setPaymentMethod(method.id)}
                style={[
                  styles.paymentMethod,
                  paymentMethod === method.id && styles.paymentMethodSelected
                ]}
              >
                <method.icon 
                  size={20} 
                  color={paymentMethod === method.id ? "#007AFF" : "#6B7280"} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === method.id && styles.paymentMethodTextSelected
                ]}>
                  {method.name}
                </Text>
                {paymentMethod === method.id && (
                  <CheckCircle2 size={16} color="#007AFF" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Formulário do Cartão (mostrar apenas se não for PIX) */}
        {paymentMethod !== 'pix' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados do Cartão</Text>
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número do Cartão</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome no Cartão</Text>
                <TextInput
                  style={styles.input}
                  placeholder="JOÃO SILVA"
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Validade</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* PIX Info */}
        {paymentMethod === 'pix' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagamento via PIX</Text>
            <View style={styles.pixInfo}>
              <Shield size={48} color="#007AFF" />
              <Text style={styles.pixTitle}>Pagamento Instantâneo</Text>
              <Text style={styles.pixDescription}>
                Escaneie o QR Code ou copie o código PIX para realizar o pagamento
              </Text>
              <View style={styles.pixCode}>
                <Text style={styles.pixCodeText}>
                  00020126580014br.gov.bcb.pix0136aae...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Resumo do Pagamento */}
        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de serviço</Text>
            <Text style={styles.summaryValue}>R$ 0,00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>

        {/* Botão de Pagamento */}
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            isProcessing && styles.paymentButtonDisabled
          ]}
          onPress={processPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Lock size={20} color="#FFFFFF" />
              <Text style={styles.paymentButtonText}>
                Pagar {formatCurrency(totalAmount)}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Shield size={16} color="#22C55E" />
          <Text style={styles.securityText}>
            Pagamento 100% seguro e criptografado
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tripSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  summaryDetails: {
    gap: 8,
  },
  ferryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  route: {
    fontSize: 16,
    color: '#6B7280',
  },
  tripTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  vehicleButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 4,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  paymentMethods: {
    gap: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  paymentMethodSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodTextSelected: {
    color: '#007AFF',
  },
  cardForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pixInfo: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    gap: 16,
  },
  pixTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  pixDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  pixCode: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
  },
  pixCodeText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  paymentSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  paymentButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  paymentButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  securityText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 40,
  },
});

export default Payment;