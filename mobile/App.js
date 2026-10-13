import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import * as SQLite from "expo-sqlite";

export default function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState([]);

  // Inicializa o banco local e cria a tabela
  useEffect(() => {
    async function initDB() {
      const database = await SQLite.openDatabaseAsync("floristica.db");
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS coletas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uri_foto TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          acuracia REAL,
          observacao TEXT,
          data_hora TEXT NOT NULL
        );
      `);
      setDb(database);
      carregarRegistros(database);
    }
    initDB();
  }, []);

  // [READ]
  const carregarRegistros = async (database) => {
    const dbInst = database || db;
    if (!dbInst) return;
    const resultado = await dbInst.getAllAsync(
      "SELECT * FROM coletas ORDER BY id DESC;",
    );
    setRegistros(resultado);
  };

  // [CREATE]
  const criarRegistro = async () => {
    if (!db) return;
    setLoading(true);

    try {
      const { status: camStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (camStatus !== "granted" || locStatus !== "granted") {
        Alert.alert("Aviso", "Permissões de Câmera e GPS necessárias.");
        setLoading(false);
        return;
      }

      const foto = await ImagePicker.launchCameraAsync({ quality: 1 });
      if (foto.canceled) {
        setLoading(false);
        return;
      }

      const comprimida = await ImageManipulator.manipulateAsync(
        foto.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const dataAtual = new Date().toLocaleString("pt-BR");

      await db.runAsync(
        `INSERT INTO coletas (uri_foto, latitude, longitude, acuracia, observacao, data_hora) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          comprimida.uri,
          pos.coords.latitude,
          pos.coords.longitude,
          pos.coords.accuracy,
          "Coleta em campo",
          dataAtual,
        ],
      );

      await carregarRegistros(db);
      Alert.alert("Sucesso", "Registro criado no SQLite!");
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  // [UPDATE]
  const atualizarRegistro = (id, observacaoAtual) => {
    Alert.prompt(
      "Editar Observação",
      "Atualize os detalhes da planta:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: async (novoTexto) => {
            if (novoTexto && db) {
              await db.runAsync(
                `UPDATE coletas SET observacao = ? WHERE id = ?;`,
                [novoTexto, id],
              );
              await carregarRegistros(db);
            }
          },
        },
      ],
      "plain-text",
      observacaoAtual,
    );
  };

  // [DELETE]
  const deletarRegistro = (id) => {
    Alert.alert(
      "Excluir Coleta",
      `Deseja realmente remover o registro #${id}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (db) {
              await db.runAsync(`DELETE FROM coletas WHERE id = ?;`, [id]);
              await carregarRegistros(db);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>CRUD Florístico Local (SQLite)</Text>

      <TouchableOpacity
        style={styles.botaoCriar}
        onPress={criarRegistro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotao}>+ Nova Coleta (Create)</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum registro no banco local.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri_foto }} style={styles.foto} />
            <View style={styles.info}>
              <Text style={styles.itemHeader}>
                #{item.id} - Lat: {item.latitude.toFixed(4)}
              </Text>
              <Text style={styles.obs}>Obs: {item.observacao}</Text>
              <Text style={styles.meta}>
                {item.data_hora} | Erro:{" "}
                {item.acuracia ? item.acuracia.toFixed(1) : 0}m
              </Text>

              <View style={styles.botoesAcao}>
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => atualizarRegistro(item.id, item.observacao)}
                >
                  <Text style={styles.textoAcao}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => deletarRegistro(item.id)}
                >
                  <Text style={styles.textoAcao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#F0F4F1",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 12,
    textAlign: "center",
  },
  botaoCriar: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  textoBotao: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  vazio: { textAlign: "center", color: "#777", marginTop: 40 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  foto: { width: 75, height: 75, borderRadius: 6, marginRight: 10 },
  info: { flex: 1 },
  itemHeader: { fontWeight: "bold", fontSize: 13, color: "#333" },
  obs: { fontSize: 12, color: "#555", marginVertical: 2 },
  meta: { fontSize: 10, color: "#888", marginBottom: 6 },
  botoesAcao: { flexDirection: "row", gap: 8 },
  botaoEditar: {
    backgroundColor: "#0277BD",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  botaoExcluir: {
    backgroundColor: "#C62828",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  textoAcao: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
});
