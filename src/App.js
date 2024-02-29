import React, { useState, useRef } from 'react';
import { Box, Textarea, Button, Flex, Text, Heading, Icon, Input } from '@chakra-ui/react';
import ColoredTextRenderer from "./ColoredTextRenderer"
import { FaGithub } from 'react-icons/fa';
import { ChromePicker } from 'react-color';

function App() {
  const [inputText, setInputText] = useState('');
  const textAreaRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleInputChange = (event) => {
    const inputColor = event.target.value;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputColor)) {
      setColor(inputColor);
    }
  };

  const handleColorPickerChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleColorBoxClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  const handleAddColor = () => {
    // Insert the color code into the input text
    const colorCode = color.substring(1); // Remove the '#' character
    insertColorCode(colorCode);
  };

  const handleColorPickerBlur = (event) => {
    // Close color picker when it loses focus
    setShowColorPicker(false);
  };


  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
  };

  const handleReset = () => {
    setInputText('');
  };

  const insertColorCode = (colorCode) => {
    const textArea = textAreaRef.current;
    const startPos = textArea.selectionStart;

    const newCursorPosition = startPos + colorCode.length + 3;

    const newText = (
      inputText.substring(0, startPos) +
      `<c${colorCode}></c>` +
      inputText.substring(startPos)
    );

    setInputText(newText);

    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const insertRainbow = () => {
    const textArea = textAreaRef.current;

    let rainbowText = '';
    for (let i = 0; i < inputText.length; i++) {
      const colorCode = (i % 7) + 1;
      rainbowText += `<c${colorCode}>${inputText[i]}</c>`;
    }

    setInputText(rainbowText);

    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(0, rainbowText.length);
    }, 0);
  };

  const parseColoredText = (text) => {
    const coloredSegments = [];
    let currentColorCode = null;
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '<' && text[i + 1] === 'c') {
        if (currentColorCode !== null) {
          coloredSegments.push({ code: currentColorCode, text: currentText });
          currentText = '';
        }

        let endIndex = text.indexOf('>', i + 2);
        if (endIndex === -1) {
          currentText += text[i];
          continue;
        }

        const tagContent = text.substring(i + 2, endIndex);
        const colorCode = parseInt(tagContent, 10);
        currentColorCode = colorCode;

        const endTag = `</c${colorCode}>`;
        const endTagIndex = text.indexOf(endTag, endIndex + 1);

        if (endTagIndex === -1) {
          currentText += text[i];
          continue;
        }

        const innerText = text.substring(endIndex + 1, endTagIndex);
        currentText += innerText;
        i = endTagIndex + endTag.length - 1;
      } else if (text[i] === '<' && text[i + 1] === '/' && text[i + 2] === 'c') {
        if (currentColorCode !== null) {
          coloredSegments.push({ code: currentColorCode, text: currentText });
          currentText = '';
          currentColorCode = null;
        }

        let endIndex = text.indexOf('>', i + 3);
        if (endIndex === -1) {
          currentText += text[i];
          continue;
        }

        i = endIndex;
      } else {
        currentText += text[i];
      }
    }

    if (currentColorCode !== null) {
      coloredSegments.push({ code: currentColorCode, text: currentText });
    }

    if (coloredSegments.length === 0) {
      coloredSegments.push({ code: 0, text: text })
    }

    return coloredSegments;
  };

  return (
    <Box bg="gray.800" h="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box bg="lightgray" p="4" borderRadius="md">
        <Heading as="h1" textAlign="center" mb="4">Text Generator for Clash of Clans</Heading>
        <Flex mb="4">
          <Button colorScheme="blackAlpha" onClick={() => insertColorCode('0')} mr="2">Black</Button>
          <Button colorScheme="whiteAlpha" bg="black" color="white" onClick={() => insertColorCode('1')} mr="2">White</Button>
          <Button colorScheme="red" onClick={() => insertColorCode('2')} mr="2">Light Red</Button>
          <Button colorScheme="green" onClick={() => insertColorCode('3')} mr="2">Green</Button>
          <Button colorScheme="blue" onClick={() => insertColorCode('4')} mr="2">Blue</Button>
          <Button colorScheme="blue" onClick={() => insertColorCode('5')} mr="2">Light Blue</Button>
          <Button colorScheme="pink" onClick={() => insertColorCode('6')} mr="2">Pink</Button>
          <Button colorScheme="yellow" onClick={() => insertColorCode('7')} mr="2">Yellow</Button>
          <Button colorScheme="red" onClick={() => insertColorCode('9')} mr="2">Dark Red</Button>
          <Button colorScheme="purple" onClick={() => insertRainbow()}>Rainbow</Button>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text fontSize="xx-large">Preview:</Text>
          <Flex alignItems="center">
            <Box
              w="20px"
              h="20px"
              bg={color}
              border="1px solid black"
              onClick={handleColorBoxClick}
              cursor="pointer"
            />
            {showColorPicker && (
              <Box position="absolute" zIndex="1" mt="-5rem" onBlur={handleColorPickerBlur}>
                <ChromePicker
                  color={color}
                  onChange={handleColorPickerChange}
                  onChangeComplete={handleColorBoxClick}
                />
              </Box>
            )}
            <Input
              type="text"
              value={color}
              onChange={handleInputChange}
              placeholder="Enter color code"
              ml="2"
            />
            <Button onClick={handleAddColor} ml="2">Add Color</Button>
          </Flex>
          <Flex>
            <Button colorScheme="red" onClick={handleReset} mr="2">Reset</Button>
            <Button colorScheme="blue" onClick={handleCopyToClipboard} mr="2">Copy to clipboard</Button>
          </Flex>
        </Flex>
        <Textarea
          ref={textAreaRef}
          value={inputText}
          onChange={handleInputTextChange}
          placeholder="Enter your text here..."
        />
        <Box mt="4">
          <ColoredTextRenderer parts={parseColoredText(inputText)} />
        </Box>
        <Text position="absolute" bottom="1" left="50%" transform="translateX(-50%)" color="gray">This site is not associated with Supercell. It is a non-profit, open-source project.</Text>
        <Box position="absolute" bottom="6" left="50%" transform="translateX(-50%)">
          <a href="https://github.com/MegalithOfficial" target="_blank" rel="noopener noreferrer">
            <Icon as={FaGithub} boxSize="8" color="gray.500" />
          </a>
        </Box>
      </Box>
    </Box>
  );
}


export default App;
