import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

describe('Firestore Security Rules', () => {
  let testEnv

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "kca-event-management",
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080
      }
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  test('Admin can create events', async () => {
    const adminContext = testEnv.authenticatedContext('admin1', {
      email: 'admin@kca.edu',
      role: 'admin'
    })
    await assertSucceeds(
      addDoc(collection(adminContext.firestore(), 'events'), {
        title: 'Admin Event'
      })
    )
  })

  test('Student cannot create events', async () => {
    const studentContext = testEnv.authenticatedContext('student1', {
      email: 'student@kca.edu',
      role: 'student'
    })
    await assertFails(
      addDoc(collection(studentContext.firestore(), 'events'), {
        title: 'Student Event'
      })
    )
  })
})
