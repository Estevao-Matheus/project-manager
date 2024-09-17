import express, { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Project from '../models/project.model';

const router = express.Router();

type StatusType = 'Concluído' | 'Em andamento' | 'Pendente';

const validStatuses: Record<string, StatusType> = {
    'Concluido': 'Concluído',
    'Em andamento': 'Em andamento',
    'Pendente': 'Pendente'
};

const normalizeStatus = (status: string): StatusType => {
    return validStatuses[status] || status as StatusType;
};


const parseDate = (dateStr: string): Date | null => {
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
};


export const streamCsv = async (req: Request, res: Response): Promise<void> => {
    const results: any[] = [];
    const filePath = path.join(__dirname, '..', 'data', 'projects.csv');
    let rowCount = 0;

    fs.createReadStream(filePath)
        .pipe(csv({ separator: ';', headers: ['id', 'nome', 'descricao', 'data_inicio', 'data_fim', 'status'] }))
        .on('data', (row: any) => {
            if (rowCount < 10) {
                const { id, nome, descricao, data_inicio, data_fim, status } = row;


                const validDataInicio = parseDate(data_inicio);
                const validDataFim = parseDate(data_fim);
                const normalizedStatus = normalizeStatus(status);

                console.log(`Row data: ${JSON.stringify(row)}`);


                if (nome && descricao && validDataInicio && validDataFim && normalizedStatus) {
                    results.push({
                        nome,
                        descricao,
                        data_inicio: validDataInicio,
                        data_fim: validDataFim,
                        status: normalizedStatus
                    });
                    rowCount++;
                } else {
                    console.warn(`Invalid row found: ${JSON.stringify(row)}`);
                }
            }
        })
        .on('end', async () => {
            console.log(`Parsed data: ${JSON.stringify(results)}`);
            try {
                // Save each project to the database
                for (const projectData of results) {
                    console.log(`Saving project: ${JSON.stringify(projectData)}`);
                    await Project.create(projectData);
                }

                res.status(200).json({ message: 'CSV data successfully saved to the database' });
            } catch (err: any) {
                console.error('Error saving to database:', err);
                res.status(500).json({ message: 'Error saving CSV data to the database', error: err.message });
            }
        })
        .on('error', (err: Error) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ message: 'Error reading CSV file', error: err.message });
        });
};

export default router;
