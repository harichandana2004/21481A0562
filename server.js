const express = require('express');
const app = express();
const PORT = process.env.PORT || 9876;

const WINDOW_SIZE = 10;
let numbersWindow = [2,4,6,8];

function fetchNumbers(numberid) {
    // Mock function to simulate fetching numbers
    switch (numberid) {
        case 'p':
            return [2, 3, 5, 7, 11];
        case 'f':
            return [1, 1, 2, 3, 5, 8];
        case 'e':
            return [6,8,10,12,14,16,18,19,20,22,24,26,28,30];
        case 'r':
            return [1, 7, 3, 9, 4];
        default:
            return [];
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

app.get('/numbers/:numberid', (req, res) => {
    const numberid = req.params.numberid;
    const validIds = ['p', 'f', 'e', 'r'];

    if (!validIds.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid numberid' });
    }

    // Fetch numbers
    const fetchedNumbers = fetchNumbers(numberid);
    if (fetchedNumbers.length === 0) {
        return res.status(500).json({ error: 'Failed to fetch numbers' });
    }

    // Ensure unique numbers
    const uniqueNumbers = [...new Set(fetchedNumbers)];

    // Update window state
    const windowPrevState = [2,4,6,8];
    uniqueNumbers.forEach(num => {
        if (numbersWindow.length >= WINDOW_SIZE) {
            numbersWindow.shift();
        }
        numbersWindow.push(num);
    });

    // Calculate average
    const avg = calculateAverage(numbersWindow);

    // Create response
    const response = {
        windowPrevState,
        windowCurrState: numbersWindow,
        numbers: uniqueNumbers,
        avg: avg.toFixed(2)
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
