/**
 * @param {Array<Function>} tasks - Array of async functions
 * @param {number} limit - Maximum number of concurrent tasks
 * @returns {Promise<Array>} - Promise that resolves to array of results
 */
async function runTasksWithLimit(tasks, limit) {
  if (!Array.isArray(tasks)) {
    throw new Error('Tasks must be an array');
  }

  if (typeof limit !== 'number' || limit <= 0) {
    throw new Error('Limit must be a positive number');
  }

  if (tasks.length === 0) {
    return [];
  }

  const results = new Array(tasks.length);
  const activePromises = new Set();
  let currentIndex = 0;

  /**
   * @param {number} taskIndex - Index of the task in the original array
   */
  async function runTask(taskIndex) {
    try {
      const task = tasks[taskIndex];
      const result = await task();
      results[taskIndex] = { success: true, data: result };
    } catch (error) {
      results[taskIndex] = { success: false, error };
    }
  }

  async function processNextTask() {
    if (currentIndex >= tasks.length) {
      return;
    }

    const taskIndex = currentIndex++;
    const taskPromise = runTask(taskIndex);

    activePromises.add(taskPromise);

    taskPromise.finally(() => {
      activePromises.delete(taskPromise);
      return processNextTask();
    });

    return taskPromise;
  }

  const initialTasks = [];
  for (let i = 0; i < Math.min(limit, tasks.length); i++) {
    initialTasks.push(processNextTask());
  }

  await Promise.all(initialTasks);

  while (activePromises.size > 0) {
    await Promise.race(activePromises);
  }

  return results;
}

async function example1() {
  console.log('🚀 Example 1: Basic tasks');

  const tasks = [
    () => new Promise((resolve) => setTimeout(() => resolve('Task 1'), 1000)),
    () => new Promise((resolve) => setTimeout(() => resolve('Task 2'), 500)),
    () => new Promise((resolve) => setTimeout(() => resolve('Task 3'), 800)),
    () => new Promise((resolve) => setTimeout(() => resolve('Task 4'), 300)),
    () => new Promise((resolve) => setTimeout(() => resolve('Task 5'), 600)),
  ];

  const startTime = Date.now();
  const results = await runTasksWithLimit(tasks, 2);
  const endTime = Date.now();

  console.log('Results:', results);
  console.log(`Execution time: ${endTime - startTime}ms`);
}

async function example2() {
  console.log('🚀 Example 2: Error handling');

  const tasks = [
    () => Promise.resolve('Success 1'),
    () => Promise.reject(new Error('Error in task 2')),
    () => Promise.resolve('Success 3'),
    () => Promise.reject(new Error('Error in task 4')),
    () => Promise.resolve('Success 5'),
  ];

  const startTime = Date.now();
  const results = await runTasksWithLimit(tasks, 3);
  const endTime = Date.now();

  console.log('Results with errors:');
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✅ Task ${index + 1}: ${result.data}`);
    } else {
      console.log(`❌ Task ${index + 1}: ${result.error.message}`);
    }
  });
  console.log(`Execution time: ${endTime - startTime}ms`);
}

async function runExamples() {
  await example1();
  await example2();
}
runExamples();
