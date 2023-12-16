// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const exceljs = require('exceljs');
// const { addCandidateRecord, checkDuplicateEmail } = require('../controllers/candidateController');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post('/addFromExcel', upload.single('file'), async (req, res) => {
//     try {
//         const workbook = new exceljs.Workbook();
//         await workbook.xlsx.load(req.file.buffer);

//         const worksheet = workbook.getWorksheet('Sheet1'); // Use the correct name


//         // Assuming the first row is headers, starting from the second row


//         for (let i = 1; i <= worksheet.rowCount; i++) {
//             const row = worksheet.getRow(i);
//             console.log(worksheet.getRow(i).getCell(2).value);

//             const candidateData = {
//                 name: row.getCell(1).value,
//                 email: row.getCell(2).value.text,
//                 // Add other properties as needed
//             };


//             const isDuplicate = await checkDuplicateEmail(candidateData.email);

//             if (!isDuplicate) {
//                 const result = await addCandidateRecord(candidateData);
//                 if (!result.success) {
//                     return res.status(500).json({ success: false, message: 'Error adding candidate record', error: result.error });
//                 }
//             }
//         }

//         return res.json({ success: true, message: 'Excel processed successfully' });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Error processing Excel', error: error.message });
//     }
// });

// module.exports = router;






const express = require('express');
const router = express.Router();
const multer = require('multer');
const exceljs = require('exceljs');
const async = require('async'); // Add this line
const { addCandidateRecord, checkDuplicateEmail } = require('../controllers/candidateController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addFromExcel', upload.single('file'), async (req, res) => {
    try {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.getWorksheet('Sheet1'); // Use the correct name

        // Assuming the first row is headers, starting from the second row
        async.eachSeries(worksheet.getRows(), async (row, callback) => {
            try {
                const candidateData = {
                    name: row.getCell(1).value,
                    email: row.getCell(2).value.text,
                    // Add other properties as needed
                };

                const isDuplicate = await checkDuplicateEmail(candidateData.email);

                if (!isDuplicate) {
                    const result = await addCandidateRecord(candidateData);
                    if (!result.success) {
                        return callback(result.error); // Call the callback with an error
                    }
                }

                // Call the callback without an error to move to the next iteration
                callback();
            } catch (error) {
                // Handle any errors within the iteration
                callback(error);
            }
        }, (err) => {
            // This callback is called when all iterations are completed or an error occurs
            if (err) {
                return res.status(500).json({ success: false, message: 'Error processing Excel', error: err });
            }
            return res.json({ success: true, message: 'Excel processed successfully' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error processing Excel', error: error.message });
    }
});

module.exports = router;
