import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {prisma} from "./prisma"
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async(request) => {
        // title, weekDays
       
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6))
        })

        // [0,1,2] => Domingo, Segunda, Terça

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data:{
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDays => {
                        return {
                            week_day: weekDays,
                        }
                    })
                }
            }
        })

      
    })

}


