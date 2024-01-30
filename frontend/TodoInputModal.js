import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

const TodoInputModal = ({ isVisible, onDismiss, onAdd }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    onAdd(newTodo);
    setNewTodo('');
    onDismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalInput}
            placeholder="New Todo"
            placeholderTextColor="gray"
            onChangeText={setNewTodo}
            value={newTodo}
            autoFocus
          />
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
  <Text style={styles.addButtonText}>Add Items</Text>
</TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalView: {
        // margin: 20,
        marginBottom: 40,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalInput: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      addButton: {
        backgroundColor: '#21364d', // Example button background color
        padding: 8,
        textAlignVertical: 'center',
        // height: 35,
        width: '50%',
        borderRadius: 10,
        marginTop: 7, // Add margin if needed
        // ... other button styles
      },
      addButtonText: {
        color: 'white', // Change text color here
        textAlign: 'center',
        fontSize: 13,
        // ... other text styles
      },
});

export default TodoInputModal;
