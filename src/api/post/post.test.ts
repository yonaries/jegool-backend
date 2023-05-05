import request from 'supertest';
import app from '../../server';
import fakeEmail from '../utils/randomEmailGenerator';
import { Page, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

describe('POST /api/post', () => {

    describe('create post', () => {

    })

})