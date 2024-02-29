import React from 'react';
import { Text, Box } from '@chakra-ui/react';

const ColoredTextRenderer = ({ parts }) => {

    const getColorFromCode = (code) => {

        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(code)) {
            return `#${code}`;
        } else {
            switch (code) {
                case 0:
                  return 'black';
                case 1:
                  return 'white';
                case 2:
                  return 'red';
                case 3:
                  return 'green';
                case 4:
                  return 'blue';
                case 5:
                  return 'lightblue';
                case 6:
                  return 'pink';
                case 7:
                  return 'yellow';
                case 9:
                  return 'darkred';
                default:
                  return 'black';
              }
        }
      };

      return (
        <Box border="1px solid black" p="4" borderRadius="md">
          {parts.map((segment, index) => (
            <Text key={index} color={getColorFromCode(segment.code)}>
              {segment.text.replace(/<\/?[^>]+(>|$)/g, '')}
            </Text>
          ))}
        </Box>
      );
    };

export default ColoredTextRenderer;
