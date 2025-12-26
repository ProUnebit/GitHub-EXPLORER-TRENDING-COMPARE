// components/FeedbackForm.tsx
'use client';

import { useOptimistic, useRef } from 'react';
import { addFeedbackAction } from '@/app/actions';

// Описываем тип нашего фидбека (можно вытянуть из схемы Drizzle)
type TFeedback = {
    id: number;
    userName: string;
    content: string;
};

export default function FeedbackForm({
    initialItems,
}: {
    initialItems: TFeedback[];
}) {
    const formRef = useRef<HTMLFormElement>(null);

    // useOptimistic принимает:
    // 1. Текущий список из базы
    // 2. Функцию, которая говорит, как изменить этот список временно
    const [optimisticFeedbacks, addOptimisticFeedback] = useOptimistic(
        initialItems,
        (state, newFeedback: { userName: string; content: string }) => [
            ...state,
            {
                id: Math.random(), // Временный ID для ключа
                userName: newFeedback.userName,
                content: newFeedback.content,
            },
        ]
    );

    // Эта функция запускается при сабмите формы
    async function handleAction(formData: FormData) {
        const userName = formData.get('userName') as string;
        const content = formData.get('content') as string;

        // 1. Мгновенно обновляем UI
        addOptimisticFeedback({ userName, content });

        // 2. Очищаем форму сразу для удобства
        formRef.current?.reset();

        // 3. Отправляем реальный запрос на сервер
        await addFeedbackAction(formData);
    }

    return (
        <div className="max-w-md">
            <form
                ref={formRef}
                action={handleAction}
                className="mb-8 flex flex-col gap-3 rounded-lg border bg-gray-50 p-4 text-black"
            >
                <input
                    name="userName"
                    placeholder="Твое имя"
                    className="rounded border p-2"
                    required
                />
                <textarea
                    name="content"
                    placeholder="Твой отзыв"
                    className="rounded border p-2"
                    required
                />
                <button
                    type="submit"
                    className="rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                >
                    Опубликовать
                </button>
            </form>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Отзывы:</h2>
                {optimisticFeedbacks.map((fb) => (
                    <div
                        key={fb.id}
                        className="border-l-4 border-blue-500 bg-white p-3 text-black shadow-sm"
                    >
                        <p className="font-bold">{fb.userName}</p>
                        <p className="text-gray-600">{fb.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
