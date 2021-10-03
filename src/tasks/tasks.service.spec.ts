import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TaskStatus } from './tasks-status.enum'
import { TasksRepository } from './tasks.repository'
import { TasksService } from './tasks.service'

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
})

const mockUser = {
    username: 'LuisEdMB',
    id: '123456',
    password: '123456',
    tasks: []
}

describe('TasksService', () => {
    let tasksService: TasksService
    let tasksRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository, useFactory: mockTasksRepository
                }
            ],

        }).compile()
        tasksService = module.get(TasksService)
        tasksRepository = module.get(TasksRepository)
    })

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            tasksRepository.getTasks.mockResolvedValue('some')
            const result = await tasksService.getTasks(null, mockUser)
            expect(result).toEqual('some')
        })
    })

    describe('getTaskById', () => {
        it('calls getTaskById.findOne and return the result', async () => {
            const mockTask = {
                id: '12345',
                title: 'Task test',
                description: 'Task desc',
                status: TaskStatus.OPEN
            }
            tasksRepository.findOne.mockResolvedValue(mockTask)
            const result = await tasksService.getTaskById('12345', mockUser)
            expect(result).toEqual(mockTask)
        })
        it('calls getTaskById.findOne and return the error', async () => {
            tasksRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById('12345', mockUser)).rejects.toThrow(NotFoundException)
        })
    })
})