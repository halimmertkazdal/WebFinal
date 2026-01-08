import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet } from './entities/snippet.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Language } from '../languages/entities/language.entity';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectRepository(Snippet)
    private snippetRepository: Repository<Snippet>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) { }

  async create(createSnippetDto: CreateSnippetDto, user: User) {
    const snippet = this.snippetRepository.create({
      ...createSnippetDto,
      language: { id: createSnippetDto.languageId },
      user,
    });
    return this.snippetRepository.save(snippet);
  }

  findAll() {
    return this.snippetRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const snippet = await this.snippetRepository.findOne({
      where: { id },
      relations: ['language', 'user']
    });
    if (!snippet) throw new NotFoundException('Snippet not found');
    return snippet;
  }

  async update(id: number, updateSnippetDto: UpdateSnippetDto, user: User) {
    const snippet = await this.findOne(id);
    if (snippet.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own snippets');
    }
    await this.snippetRepository.update(id, {
      ...updateSnippetDto,
      ...(updateSnippetDto.languageId && { language: { id: updateSnippetDto.languageId } }),
    });
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const snippet = await this.findOne(id);
    if (snippet.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own snippets');
    }
    return this.snippetRepository.delete(id);
  }

  async createDemo(user: User) {
    let lang = await this.languageRepository.findOne({ where: {} });
    if (!lang) {
      const newLang = this.languageRepository.create({ name: 'JavaScript', colorCode: '#F7DF1E' });
      lang = await this.languageRepository.save(newLang);
    }

    const demos = [
      { title: 'React Counter', codeContent: 'const [count, setCount] = useState(0);\nreturn <button onClick={() => setCount(c => c+1)}>{count}</button>', description: 'Simple counter component' },
      { title: 'Express Server', codeContent: 'const app = express();\napp.get("/", (req, res) => res.send("Hello"));\napp.listen(3000);', description: 'Basic Express setup' },
      { title: 'Array Filter', codeContent: 'const evens = numbers.filter(n => n % 2 === 0);', description: 'Filter even numbers' },
      { title: 'Custom Hook', codeContent: 'const useToggle = (init) => {\n  const [val, setVal] = useState(init);\n  const toggle = () => setVal(!val);\n  return [val, toggle];\n}', description: 'React custom hook' },
      { title: 'CSS Flexbox', codeContent: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', description: 'Center specific div' },
      { title: 'Promise Delay', codeContent: 'const delay = ms => new Promise(res => setTimeout(res, ms));', description: 'Wait for ms' },
      { title: 'Object Keys', codeContent: 'Object.keys(user).forEach(key => {\n  console.log(key, user[key]);\n});', description: 'Iterate object' },
      { title: 'Async Await', codeContent: 'async function getData() {\n  const res = await fetch("/api/data");\n  const data = await res.json();\n  return data;\n}', description: 'Fetch data modern way' },
      { title: 'Redux Slice', codeContent: 'const countSlice = createSlice({\n  name: "count",\n  initialState: 0,\n  reducers: { inc: s => s + 1 }\n});', description: 'Redux toolkit slice' },
      { title: 'Tailwind Button', codeContent: '<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n  Button\n</button>', description: 'Styled button' },
    ];

    for (const d of demos) {
      await this.create({
        ...d,
        languageId: lang.id
      }, user);
    }

    return { message: `${demos.length} demo snippets added` };
  }
}
